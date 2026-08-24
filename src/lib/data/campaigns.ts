import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Campaign, CampaignStatus } from "@/types/database";

import { demoCampaigns } from "./demo";

const PUBLIC_STATUSES: CampaignStatus[] = ["active", "completed"];

function byPriority(a: Campaign, b: Campaign) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.created_at.localeCompare(a.created_at);
}

/** Campaigns visible to site visitors: active first, then completed. */
export async function getPublicCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured) {
    return demoCampaigns
      .filter((c) => PUBLIC_STATUSES.includes(c.status))
      .sort(byPriority);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .in("status", PUBLIC_STATUSES)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load campaigns: ${error.message}`);
  return data ?? [];
}

export async function getFeaturedCampaigns(limit = 3): Promise<Campaign[]> {
  const campaigns = await getPublicCampaigns();
  const active = campaigns.filter((c) => c.status === "active");
  return active.slice(0, limit);
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) {
    return demoCampaigns.find((c) => c.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to load campaign: ${error.message}`);
  return data;
}

/** Every campaign regardless of status — RLS restricts this to staff. */
export async function getAllCampaigns(): Promise<Campaign[]> {
  noStore();

  if (!isSupabaseConfigured) {
    return [...demoCampaigns].sort(byPriority);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load campaigns: ${error.message}`);
  return data ?? [];
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  noStore();

  if (!isSupabaseConfigured) {
    return demoCampaigns.find((c) => c.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load campaign: ${error.message}`);
  return data;
}

/** Slim list for the donation form's campaign picker. */
export async function getDonatableCampaigns() {
  const campaigns = await getPublicCampaigns();
  return campaigns
    .filter((c) => c.status === "active")
    .map(({ id, title, slug }) => ({ id, title, slug }));
}
