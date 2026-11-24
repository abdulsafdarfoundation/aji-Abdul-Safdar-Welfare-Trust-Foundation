import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Cause, Database, Post, PostKind } from "@/types/database";

/**
 * Anonymous client for public reads. These tables are readable by everyone,
 * so there is no need to carry (or touch) the visitor's session cookie.
 */
function publicClient() {
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Newest first. Returns [] on any failure so a DB hiccup never breaks a page. */
export async function getPosts(kind: PostKind): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await publicClient()
    .from("posts")
    .select("*")
    .eq("kind", kind)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Failed to load ${kind} posts:`, error.message);
    return [];
  }
  return data ?? [];
}

/** Admin-added causes, newest first. */
export async function getCauses(): Promise<Cause[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await publicClient()
    .from("causes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load causes:", error.message);
    return [];
  }
  return data ?? [];
}
