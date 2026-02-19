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
    fileName = file.name;
    const ext = file.name.split(".").pop();
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
    return NextResponse.json({ error: bidError.message }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || anonKey;

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
  } catch {
  }

  return NextResponse.json({ bid, bidId: bid.id });
}
