import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET — single project
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

// PUT — update project
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, tags, live_url, github_url, image_url, featured, sort_order } = body;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(tags !== undefined && { tags }),
      ...(live_url !== undefined && { live_url: live_url || null }),
      ...(github_url !== undefined && { github_url: github_url || null }),
      ...(image_url !== undefined && { image_url: image_url || null }),
      ...(featured !== undefined && { featured }),
      ...(sort_order !== undefined && { sort_order }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

// DELETE — remove project
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Project deleted." });
}
