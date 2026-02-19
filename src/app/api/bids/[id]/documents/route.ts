import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bidId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bid = await supabase
    .from("bids")
    .select("id")
    .eq("id", bidId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!bid.data) {
    return NextResponse.json({ error: "Bid not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const docType = formData.get("docType") as string;

  if (!file || !docType) {
    return NextResponse.json({ error: "Missing file or docType" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filePath = `${user.id}/${bidId}/${docType}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("bid-documents")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  await supabase
    .from("bid_documents")
    .delete()
    .eq("bid_id", bidId)
    .eq("doc_type", docType)
    .eq("user_id", user.id);

  const { data, error } = await supabase
    .from("bid_documents")
    .insert({
      bid_id: bidId,
      user_id: user.id,
      doc_type: docType,
      file_path: filePath,
      file_name: file.name,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const pwinBoostMap: Record<string, number> = {
    "past-performance": 25,
    "capability-statement": 20,
    "team-resumes": 10,
    "certifications": 10,
  };

  const { data: allDocs } = await supabase
    .from("bid_documents")
    .select("doc_type")
    .eq("bid_id", bidId);

  const newPwin = Math.min(
    20 + (allDocs || []).reduce((sum, d) => sum + (pwinBoostMap[d.doc_type] || 0), 0),
    85
  );

  await supabase
    .from("bids")
    .update({ pwin_score: newPwin, updated_at: new Date().toISOString() })
    .eq("id", bidId)
    .eq("user_id", user.id);

  return NextResponse.json(data, { status: 201 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bidId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bid_documents")
    .select("*")
    .eq("bid_id", bidId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
