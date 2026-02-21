import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bidId } = body;

  if (!bidId || !UUID_RE.test(bidId)) {
    return NextResponse.json({ error: "Invalid or missing bidId" }, { status: 400 });
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ bidId, userId: user.id }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.error || "Failed to create checkout session" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
