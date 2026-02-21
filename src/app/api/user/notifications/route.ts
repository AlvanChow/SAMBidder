import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Notification preferences error:", error.message);
    return NextResponse.json({ error: "Failed to process notification preferences" }, { status: 500 });
  }

  return NextResponse.json(
    data ?? {
      user_id: user.id,
      bid_status_updates: true,
      due_date_reminders: true,
      rfp_matches: false,
      weekly_summary: false,
    }
  );
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert({
      user_id: user.id,
      bid_status_updates: body.bid_status_updates ?? true,
      due_date_reminders: body.due_date_reminders ?? true,
      rfp_matches: body.rfp_matches ?? false,
      weekly_summary: body.weekly_summary ?? false,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Notification preferences error:", error.message);
    return NextResponse.json({ error: "Failed to process notification preferences" }, { status: 500 });
  }

  return NextResponse.json(data);
}
