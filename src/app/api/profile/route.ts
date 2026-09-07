import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("profiles").select("*").limit(1).single();

  if (error || !data) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { full_name, bio, avatar_url, email, location, role, social_github, social_linkedin, social_twitter } = body;

  const supabase = createAdminClient();

  const { data: current } = await supabase.from("profiles").select("id").limit(1).single();

  if (!current) {
    return NextResponse.json({ error: "No profile found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...(full_name !== undefined && { full_name }),
      ...(bio !== undefined && { bio }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(email !== undefined && { email }),
      ...(location !== undefined && { location }),
      ...(role !== undefined && { role }),
      ...(social_github !== undefined && { social_github }),
      ...(social_linkedin !== undefined && { social_linkedin }),
      ...(social_twitter !== undefined && { social_twitter }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
