import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — subscriber count (public)
export async function GET() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  if (error) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }

  return NextResponse.json({ count: count ?? 0 });
}

// POST — subscribe
export async function POST(request: Request) {
  const body = await request.json();
  const { email, name } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Valid email is required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, active")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existing && existing.active) {
    return NextResponse.json(
      { message: "You're already subscribed!" },
      { status: 200 }
    );
  }

  // Reactivate if was unsubscribed, or insert new
  if (existing) {
    const { error } = await supabase
      .from("subscribers")
      .update({ active: true, name: name || null })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: "Failed to resubscribe." }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("subscribers").insert({
      email: email.toLowerCase().trim(),
      name: name || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Subscribed successfully! 🎉" });
}

// DELETE — unsubscribe
export async function DELETE(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("subscribers")
    .update({ active: false })
    .eq("email", email.toLowerCase().trim());

  if (error) {
    return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
  }

  return NextResponse.json({ message: "Unsubscribed." });
}
