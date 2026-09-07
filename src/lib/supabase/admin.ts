import { createClient } from "@supabase/supabase-js";

// Admin client that bypasses RLS using the service role key
// ONLY use this in server-side API routes, never in the browser
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
