import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Only import this from route handlers
// under app/api/, never from components or client-side code.
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
