import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const rfpUrl = formData.get("rfpUrl") as string | null;

  let rfpFilePath = "";
  let fileName = "";

  if (file) {
    const ALLOWED_MIME_TYPES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF, Word document, or plain text file." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 20 MB size limit." },
        { status: 400 }
      );
    }

    fileName = file.name;
    const extMatch = file.name.match(/\.([^./]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "bin";
    rfpFilePath = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("rfp-uploads")
      .upload(rfpFilePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
  }

  const { data: bid, error: bidError } = await supabase
    .from("bids")
    .insert({
      user_id: user.id,
      title: fileName || rfpUrl || "New RFP",
      status: "draft",
      rfp_file_path: rfpFilePath,
      rfp_url: rfpUrl || "",
      pwin_score: 20,
      compliance_score: 0,
    })
    .select()
    .single();

  if (bidError) {
    // Clean up the uploaded file to avoid orphaned storage objects
    if (rfpFilePath) {
      await supabase.storage.from("rfp-uploads").remove([rfpFilePath]);
    }
    return NextResponse.json({ error: bidError.message }, { status: 500 });
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  try {
    const parseResponse = await fetch(
      `${supabaseUrl}/functions/v1/parse-rfp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          bidId: bid.id,
          rfpFilePath: rfpFilePath || null,
          rfpUrl: rfpUrl || null,
        }),
      }
    );

    if (parseResponse.ok) {
      const parseData = await parseResponse.json();
      return NextResponse.json({ bid: { ...bid, ...parseData }, bidId: bid.id });
    }

    console.error("parse-rfp failed:", parseResponse.status, await parseResponse.text().catch(() => ""));
  } catch (parseError) {
    console.error("parse-rfp call failed:", parseError);
  }

  return NextResponse.json({ bid, bidId: bid.id });
}
