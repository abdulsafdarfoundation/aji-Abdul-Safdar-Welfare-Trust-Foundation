import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { SUPABASE_URL, assertSupabase } from "./config";

/**
 * Service-role client. **Bypasses RLS entirely** — never import this into a
 * Client Component, and always verify the caller's permission yourself first.
 *
 * Reserved for: payment webhooks marking a donation complete, and admin-only
 * mutations that must sidestep the "insert must be pending" policy.
 */
export function createAdminClient() {
  assertSupabase();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
  }

  return createSupabaseClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
