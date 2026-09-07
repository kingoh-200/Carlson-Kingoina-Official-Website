import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  const supabase = createAdminClient();

  let query = supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ testimonials: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ testimonials: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, role, company, content, avatar_url, featured } = body;

  if (!name || !content) {
    return NextResponse.json({ error: "Name and content are required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("testimonials")
    .insert({ name, role: role || null, company: company || null, content, avatar_url: avatar_url || null, featured: featured || false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data });
}
