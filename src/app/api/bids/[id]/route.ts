import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bids")
    .select(`
      *,
      compliance_items(*),
      bid_documents(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Bid fetch error:", error.message);
    return NextResponse.json({ error: "Failed to load bid" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Whitelist user-editable fields to prevent overwriting computed or sensitive columns
  const ALLOWED_FIELDS = [
    "title",
    "status",
    "solicitation_number",
    "agency",
    "naics_code",
    "set_aside",
    "due_date",
    "estimated_value_min",
    "estimated_value_max",
  ] as const;
  type AllowedField = (typeof ALLOWED_FIELDS)[number];

  const safeUpdate = Object.fromEntries(
    ALLOWED_FIELDS.filter((k) => k in body).map((k) => [k, body[k as AllowedField]])
  );

  const { data, error } = await supabase
    .from("bids")
    .update({ ...safeUpdate, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Bid update error:", error.message);
    return NextResponse.json({ error: "Failed to update bid" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid bid ID" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("bids")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Bid delete error:", error.message);
    return NextResponse.json({ error: "Failed to delete bid" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
