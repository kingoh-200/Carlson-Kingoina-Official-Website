import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_PAGES = new Set(["home", "projects"]);

function getPage(request: Request) {
  const page = new URL(request.url).searchParams.get("page");
  return page && VALID_PAGES.has(page) ? page : null;
}

export async function GET(request: Request) {
  const page = getPage(request);
  if (!page) return NextResponse.json({ error: "Unknown page." }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("page_likes")
      .select("count")
      .eq("page", page)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ count: data?.count ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load likes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const page = getPage(request);
  if (!page) return NextResponse.json({ error: "Unknown page." }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("increment_page_likes", { page_name: page });

    if (error) throw error;
    return NextResponse.json({ count: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save like." },
      { status: 500 }
    );
  }
}
