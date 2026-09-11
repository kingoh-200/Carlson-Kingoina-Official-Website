import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EXISTING_SUBSCRIBERS = 21;

async function getSubscriberTotal() {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  if (error) throw error;
  return EXISTING_SUBSCRIBERS + (count ?? 0);
}

export async function GET() {
  try {
    return NextResponse.json({ count: await getSubscriberTotal() });
  } catch {
    return NextResponse.json({ count: EXISTING_SUBSCRIBERS });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, active")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existing && existing.active) {
    return NextResponse.json({ message: "You're already subscribed!", alreadySubscribed: true, count: await getSubscriberTotal() });
  }

  if (existing) {
    const { error } = await supabase.from("subscribers").update({ active: true, name: name || null }).eq("id", existing.id);
    if (error) return NextResponse.json({ error: "Failed to resubscribe." }, { status: 500 });
  } else {
    const { error } = await supabase.from("subscribers").insert({ email: email.toLowerCase().trim(), name: name || null });
    if (error) return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }

  return NextResponse.json({ message: "Subscribed successfully!", count: await getSubscriberTotal() });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  const supabase = createAdminClient();

  const { error } = await supabase.from("subscribers").update({ active: false }).eq("email", email.toLowerCase().trim());
  if (error) return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });

  return NextResponse.json({ message: "Unsubscribed." });
}
