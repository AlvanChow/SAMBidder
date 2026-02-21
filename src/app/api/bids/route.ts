import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Omit large text columns (raw_rfp_text, executive_summary, full_proposal)
  // that are only needed on the bid detail page, not the list view.
  const { data, error } = await supabase
    .from("bids")
    .select(
      "id, user_id, title, solicitation_number, agency, naics_code, set_aside, status, pwin_score, estimated_value_min, estimated_value_max, due_date, compliance_score, rfp_file_path, rfp_url, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Bids list error:", error.message);
    return NextResponse.json({ error: "Failed to load bids" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Whitelist fields to prevent mass assignment of computed/sensitive columns
  // (e.g. pwin_score, compliance_score, paid_at, stripe_session_id).
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
    "rfp_file_path",
    "rfp_url",
  ] as const;

  const safeInsert = Object.fromEntries(
    ALLOWED_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])
  );

  const { data, error } = await supabase
    .from("bids")
    .insert({ ...safeInsert, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Bid create error:", error.message);
    return NextResponse.json({ error: "Failed to create bid" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
