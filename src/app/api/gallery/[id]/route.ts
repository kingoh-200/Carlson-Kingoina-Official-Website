import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET — single image
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  return NextResponse.json({ image: data });
}

// PUT — update image
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, url, alt, category, sort_order } = body;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(url !== undefined && { url }),
      ...(alt !== undefined && { alt }),
      ...(category !== undefined && { category }),
      ...(sort_order !== undefined && { sort_order }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ image: data });
}

// DELETE — remove image
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Image deleted." });
}
