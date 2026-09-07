import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, role, company, content, avatar_url, featured, sort_order } = body;

  const supabase = createAdminClient();

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted." });
}
