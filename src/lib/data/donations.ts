import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  Donation,
  DonationStatus,
  DonationWithCampaign,
} from "@/types/database";

import { demoCampaigns, demoDonations } from "./demo";

/**
 * Donations created while running without Supabase. Lives in module memory, so
 * it resets whenever the dev server restarts — enough to walk the donate →
 * thank-you → admin flow end to end.
 */
const demoInbox: Donation[] = [];

function allDemoDonations(): Donation[] {
  return [...demoInbox, ...demoDonations].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

function withCampaignTitle(donation: Donation): DonationWithCampaign {
  const campaign = demoCampaigns.find((c) => c.id === donation.campaign_id);
  return { ...donation, campaign_title: campaign?.title ?? null };
}

export type DonationFilters = {
  status?: DonationStatus | "all";
  campaignId?: string | "all";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type DonationPage = {
  rows: DonationWithCampaign[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export async function listDonations({
  status = "all",
  campaignId = "all",
  search = "",
  page = 1,
  pageSize = 20,
}: DonationFilters = {}): Promise<DonationPage> {
  noStore();

  const from = (page - 1) * pageSize;
  const term = search.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    const filtered = allDemoDonations()
      .filter((d) => status === "all" || d.status === status)
      .filter((d) => campaignId === "all" || d.campaign_id === campaignId)
      .filter(
        (d) =>
          !term ||
          d.donor_name.toLowerCase().includes(term) ||
          d.donor_email.toLowerCase().includes(term) ||
          d.reference.toLowerCase().includes(term),
      );

    return {
      rows: filtered.slice(from, from + pageSize).map(withCampaignTitle),
      total: filtered.length,
      page,
      pageSize,
      pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("donations")
    .select("*, campaigns(title)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (status !== "all") query = query.eq("status", status);
  if (campaignId !== "all") query = query.eq("campaign_id", campaignId);
  if (term) {
    query = query.or(
      `donor_name.ilike.%${term}%,donor_email.ilike.%${term}%,reference.ilike.%${term}%`,
    );
  }

  const { data, error, count } = await query;
  if (error) throw new Error(`Failed to load donations: ${error.message}`);

  const rows = (data ?? []).map((row) => {
    const { campaigns, ...donation } = row as Donation & {
      campaigns: { title: string } | null;
    };
    return { ...donation, campaign_title: campaigns?.title ?? null };
  });

  const total = count ?? rows.length;
  return {
    rows,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getRecentDonations(limit = 6): Promise<DonationWithCampaign[]> {
  const { rows } = await listDonations({ pageSize: limit });
  return rows;
}

/** Completed donations shown publicly on a campaign page. */
export async function getCampaignSupporters(
  campaignId: string,
  limit = 8,
): Promise<Pick<Donation, "id" | "donor_name" | "amount" | "message" | "is_anonymous" | "created_at">[]> {
  if (!isSupabaseConfigured) {
    return allDemoDonations()
      .filter((d) => d.campaign_id === campaignId && d.status === "completed")
      .slice(0, limit);
  }

  // Requires a public read policy on donations if you want this live; with the
  // default policies in 0001_init.sql only staff can read, so this returns [].
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("id, donor_name, amount, message, is_anonymous, created_at")
    .eq("campaign_id", campaignId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getDonationByReference(
  reference: string,
): Promise<DonationWithCampaign | null> {
  noStore();

  if (!isSupabaseConfigured) {
    const match = allDemoDonations().find((d) => d.reference === reference);
    return match ? withCampaignTitle(match) : null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("*, campaigns(title)")
    .eq("reference", reference)
    .maybeSingle();

  if (!data) return null;
  const { campaigns, ...donation } = data as Donation & {
    campaigns: { title: string } | null;
  };
  return { ...donation, campaign_title: campaigns?.title ?? null };
}

/** Used by the donate Server Action after the (stubbed) payment step. */
export async function insertDonation(
  donation: Omit<Donation, "id" | "created_at" | "completed_at">,
): Promise<Donation> {
  if (!isSupabaseConfigured) {
    const record: Donation = {
      ...donation,
      id: `demo-${donation.reference}`,
      created_at: new Date().toISOString(),
      completed_at: donation.status === "completed" ? new Date().toISOString() : null,
    };
    demoInbox.unshift(record);
    return record;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .insert(donation)
    .select()
    .single();

  if (error) throw new Error(`Could not record donation: ${error.message}`);
  return data;
}

export async function setDonationStatus(id: string, status: DonationStatus) {
  if (!isSupabaseConfigured) {
    const target = demoInbox.find((d) => d.id === id) ?? demoDonations.find((d) => d.id === id);
    if (!target) throw new Error("Donation not found");
    target.status = status;
    target.completed_at = status === "completed" ? new Date().toISOString() : null;
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("donations").update({ status }).eq("id", id);
  if (error) throw new Error(`Could not update donation: ${error.message}`);
}
