import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const supabase = createAdminClient();

    let query = supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ projects: [], error: error.message });
    }

    return NextResponse.json({ projects: data ?? [] });
  } catch (err) {
    return NextResponse.json({
      projects: [],
      error: err instanceof Error ? err.message : "Supabase not configured",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, tags, live_url, github_url, image_url, featured } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title, description,
        tags: tags || [],
        live_url: live_url || null,
        github_url: github_url || null,
        image_url: image_url || null,
        featured: featured || false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ project: data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
