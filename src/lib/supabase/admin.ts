import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin client that bypasses RLS using the service role key
// Falls back to anon client if service role key is not set
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set in environment variables.");
  }

  // Use service role key if available (bypasses RLS), otherwise use anon key
  const key = serviceKey || anonKey;

  if (!key) {
    throw new Error("No Supabase key found. Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
