import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — list all gallery images (public)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const supabase = await createClient();

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

// POST — upload a new image (authenticated)
export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, url, alt, category } = body;

  if (!title || !url) {
    return NextResponse.json(
      { error: "Title and URL are required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ image: data });
}
