import "server-only";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/** Stand-in identity used when Supabase is not configured. */
export const DEMO_PROFILE: Profile = {
  id: "00000000-0000-4000-8000-000000000000",
  email: "demo@hopefoundation.org",
  full_name: "Demo Administrator",
  avatar_url: null,
  role: "admin",
  created_at: "2026-01-01T00:00:00Z",
};

/** The signed-in user's profile, or null. Never throws. */
export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return DEMO_PROFILE;

  const supabase = await createClient();

  // getUser() verifies the JWT with Supabase. getSession() only reads a cookie,
  // which a visitor can forge — never gate access on it.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

const STAFF_ROLES: UserRole[] = ["admin", "editor"];

/**
 * Gate for every page under /admin. Redirects to the login screen when there is
 * no session, and to /no-access when the account exists but lacks a staff role.
 *
 * /no-access deliberately lives outside the admin route group: inside it, the
 * layout would run this same check and bounce the user in a loop.
 */
export async function requireStaff(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/admin");
  if (!STAFF_ROLES.includes(profile.role)) redirect("/no-access");
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== "admin") redirect("/no-access");
  return profile;
}

export function canEdit(profile: Profile | null) {
  return !!profile && STAFF_ROLES.includes(profile.role);
}
