import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Campaign, Donation, DonationStatus } from "@/types/database";

import { demoCampaigns, demoDonations } from "./demo";

export type MonthPoint = { label: string; iso: string; total: number; count: number };

export type DashboardStats = {
  totalRaised: number;
  donationCount: number;
  donorCount: number;
  averageGift: number;
  activeCampaigns: number;
  monthlyRecurring: number;
  pendingCount: number;
  /** Percent change in completed money, this calendar month vs last. */
  raisedChangePct: number | null;
  monthly: MonthPoint[];
  statusBreakdown: { status: DonationStatus; count: number; total: number }[];
  topCampaigns: { id: string; title: string; raised: number; goal: number }[];
};

const MONTHS_SHOWN = 6;

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

/** The last N calendar months ending with `now`, oldest first. */
function monthBuckets(now: Date): MonthPoint[] {
  const points: MonthPoint[] = [];
  for (let back = MONTHS_SHOWN - 1; back >= 0; back--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1));
    points.push({
      label: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      iso: d.toISOString().slice(0, 7),
      total: 0,
      count: 0,
    });
  }
  return points;
}

function summarize(donations: Donation[], campaigns: Campaign[]): DashboardStats {
  const now = new Date();
  const completed = donations.filter((d) => d.status === "completed");

  const totalRaised = completed.reduce((sum, d) => sum + d.amount, 0);
  const donorCount = new Set(completed.map((d) => d.donor_email.toLowerCase())).size;

  const monthly = monthBuckets(now);
  const byMonth = new Map(monthly.map((point) => [point.iso, point]));
  for (const d of completed) {
    const bucket = byMonth.get(monthKey(d.completed_at ?? d.created_at));
    if (bucket) {
      bucket.total += d.amount;
      bucket.count += 1;
    }
  }

  const thisMonth = monthly.at(-1)?.total ?? 0;
  const lastMonth = monthly.at(-2)?.total ?? 0;
  const raisedChangePct =
    lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null;

  const statuses: DonationStatus[] = ["completed", "pending", "failed", "refunded"];
  const statusBreakdown = statuses.map((status) => {
    const rows = donations.filter((d) => d.status === status);
    return {
      status,
      count: rows.length,
      total: rows.reduce((sum, d) => sum + d.amount, 0),
    };
  });

  const topCampaigns = [...campaigns]
    .filter((c) => c.status === "active" || c.status === "completed")
    .sort((a, b) => b.raised_amount - a.raised_amount)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      title: c.title,
      raised: c.raised_amount,
      goal: c.goal_amount,
    }));

  return {
    totalRaised,
    donationCount: completed.length,
    donorCount,
    averageGift: completed.length ? Math.round(totalRaised / completed.length) : 0,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    monthlyRecurring: completed
      .filter((d) => d.frequency === "monthly")
      .reduce((sum, d) => sum + d.amount, 0),
    pendingCount: donations.filter((d) => d.status === "pending").length,
    raisedChangePct,
    monthly,
    statusBreakdown,
    topCampaigns,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  noStore();

  if (!isSupabaseConfigured) {
    return summarize(demoDonations, demoCampaigns);
  }

  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - MONTHS_SHOWN);
  cutoff.setUTCDate(1);

  const [donationsResult, campaignsResult] = await Promise.all([
    supabase.from("donations").select("*").gte("created_at", cutoff.toISOString()),
    supabase.from("campaigns").select("*"),
  ]);

  if (donationsResult.error) {
    throw new Error(`Failed to load donations: ${donationsResult.error.message}`);
  }
  if (campaignsResult.error) {
    throw new Error(`Failed to load campaigns: ${campaignsResult.error.message}`);
  }

  const stats = summarize(donationsResult.data ?? [], campaignsResult.data ?? []);

  // The donation query above is windowed to MONTHS_SHOWN so the chart stays
  // cheap. Lifetime figures come from an aggregate in the database instead of
  // summing a trimmed list client-side.
  const { data: totals } = await supabase.rpc("donation_totals").maybeSingle();

  if (totals) {
    stats.totalRaised = Number(totals.total_raised);
    stats.donationCount = Number(totals.donation_count);
    stats.donorCount = Number(totals.donor_count);
    stats.pendingCount = Number(totals.pending_count);
    stats.monthlyRecurring = Number(totals.monthly_recurring);
    stats.averageGift = stats.donationCount
      ? Math.round(stats.totalRaised / stats.donationCount)
      : 0;
  }

  return stats;
}
