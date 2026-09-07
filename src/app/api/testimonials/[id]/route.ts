import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ testimonial: data });
}

// PUT
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, role, company, content, avatar_url, featured, sort_order } = body;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .update({
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(company !== undefined && { company }),
      ...(content !== undefined && { content }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(featured !== undefined && { featured }),
      ...(sort_order !== undefined && { sort_order }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ testimonial: data });
}

// DELETE
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted." });
}
