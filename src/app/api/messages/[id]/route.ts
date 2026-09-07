import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

// PUT — mark as read
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ read: body.read ?? true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data });
}

// DELETE
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted." });
}
