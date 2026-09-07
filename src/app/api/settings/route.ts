import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("site_settings").select("*").order("key");

  if (error) {
    return NextResponse.json({ settings: {}, error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  (data ?? []).forEach((s) => { settings[s.key] = s.value; });

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json({ error: "Key and value are required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ setting: data });
}
