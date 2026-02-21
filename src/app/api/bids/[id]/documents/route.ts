import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bidId } = await params;
  if (!UUID_RE.test(bidId)) {
    return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
  }
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

  // Validate docType against allowed values to prevent path traversal
  const ALLOWED_DOC_TYPES = [
    "past-performance",
    "capability-statement",
    "team-resumes",
    "certifications",
  ];
  if (!ALLOWED_DOC_TYPES.includes(docType)) {
    return NextResponse.json(
      { error: `Invalid document type. Allowed: ${ALLOWED_DOC_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate file type
  const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF, Word document, or plain text file." },
      { status: 400 }
    );
  }

  // Validate file size (20 MB limit)
  const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 20 MB size limit." },
      { status: 400 }
    );
  }

  const extMatch = file.name.match(/\.([^./]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "bin";
  const filePath = `${user.id}/${bidId}/${docType}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("bid-documents")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Document upload error:", uploadError.message);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
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
    console.error("Document record insert error:", error.message);
    return NextResponse.json({ error: "Failed to save document record" }, { status: 500 });
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
  if (!UUID_RE.test(bidId)) {
    return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
  }
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
    console.error("Documents list error:", error.message);
    return NextResponse.json({ error: "Failed to load documents" }, { status: 500 });
  }

  return NextResponse.json(data);
}
