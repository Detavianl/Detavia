import { createClient as createSbClient } from "@supabase/supabase-js";

// Service-role client: ALLEEN server-side gebruiken (bypass RLS).
// Voor publieke instroom (sollicitatie + cv-upload, contactbericht) en seeding.
export function createAdminClient() {
  return createSbClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim(),
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
