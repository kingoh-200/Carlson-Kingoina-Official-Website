import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — public profile
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Profile not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile: data });
}

// PUT — update profile (authenticated)
export async function PUT(request: Request) {
  const body = await request.json();
  const {
    full_name,
    bio,
    avatar_url,
    email,
    location,
    social_github,
    social_linkedin,
    social_twitter,
  } = body;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...(full_name && { full_name }),
      ...(bio !== undefined && { bio }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(email && { email }),
      ...(location !== undefined && { location }),
      ...(social_github !== undefined && { social_github }),
      ...(social_linkedin !== undefined && { social_linkedin }),
      ...(social_twitter !== undefined && { social_twitter }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", (await supabase.from("profiles").select("id").limit(1).single()).data?.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
