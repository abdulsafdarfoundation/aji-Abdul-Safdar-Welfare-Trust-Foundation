import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabase } from "./config";

/** Supabase client for Client Components. */
export function createClient() {
  assertSupabase();
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
