import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabase } from "./config";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Carries the visitor's session, so RLS applies as that user.
 */
export async function createClient() {
  assertSupabase();
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, which cannot set cookies.
          // proxy.ts refreshes the session instead — safe to ignore.
        }
      },
    },
  });
}
