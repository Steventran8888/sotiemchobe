// Public URL + anon key are safe to expose client-side (protected by RLS),
// same as Comtrua's lib/supabaseClient.ts. Falls back to the known values so
// builds don't break in environments where the env vars aren't configured yet.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jxegzfumfqdtwkgpvruq.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZWd6ZnVtZnFkdHdrZ3B2cnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMDQ0NjksImV4cCI6MjEwMTc4MDQ2OX0.MIJ0uaP0XFKYnuGInaNUeQGUa78gO7ZGYmOGpQADTyQ";
