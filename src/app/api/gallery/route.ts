import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const supabase = createAdminClient();

  let query = supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ images: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ images: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, url, alt, category } = body;

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      title,
      description: description || null,
      url,
      alt: alt || title,
      category: category || "general",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ image: data });
}
