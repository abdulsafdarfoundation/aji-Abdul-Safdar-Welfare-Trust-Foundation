import Link from "next/link";
import { Suspense } from "react";
import { Banknote, HandCoins, Megaphone, Repeat, Users } from "lucide-react";

import { DonationStatusBadge } from "@/components/admin/donation-status-badge";
import { DonationsChart } from "@/components/admin/donations-chart";
import { StatCard } from "@/components/admin/stat-card";
import { ProgressMeter } from "@/components/campaigns/progress-meter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/lib/data/stats";
import { getRecentDonations } from "@/lib/data/donations";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatNumber,
  publicDonorName,
} from "@/lib/format";

export default async function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Money in, campaign progress, and anything waiting on you.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new">New campaign</Link>
        </Button>
      </header>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}

async function OverviewContent() {
  const [stats, recent] = await Promise.all([getDashboardStats(), getRecentDonations(6)]);

  return (
    <>
      <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total raised"
          value={formatCompactCurrency(stats.totalRaised)}
          icon={Banknote}
          changePct={stats.raisedChangePct}
          hint="vs last month"
        />
        <StatCard
          label="Donations"
          value={formatNumber(stats.donationCount)}
          icon={HandCoins}
          hint={`${formatCurrency(stats.averageGift)} average gift`}
        />
        <StatCard
          label="Donors"
          value={formatNumber(stats.donorCount)}
          icon={Users}
          hint="unique email addresses"
        />
        <StatCard
          label="Monthly recurring"
          value={formatCompactCurrency(stats.monthlyRecurring)}
          icon={Repeat}
          hint="committed each month"
        />
      </section>

      {stats.pendingCount > 0 && (
        <section className="flex flex-wrap items-center gap-4 rounded-xl border border-warning/40 bg-warning/10 p-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">
              {formatNumber(stats.pendingCount)} donation
              {stats.pendingCount === 1 ? "" : "s"} awaiting confirmation
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Payments are not automated yet — mark them completed once the money has
              landed, and campaign totals will update.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/donations?status=pending">Review them</Link>
          </Button>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Income over time</h2>
          <div className="mt-6">
            <DonationsChart data={stats.monthly} />
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Campaign progress</h2>
            <Link
              href="/admin/campaigns"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Manage
            </Link>
          </div>

          {stats.topCampaigns.length > 0 ? (
            <ul className="mt-5 space-y-5">
              {stats.topCampaigns.map((campaign) => (
                <li key={campaign.id} className="space-y-2">
                  <p className="truncate text-sm font-medium">{campaign.title}</p>
                  <ProgressMeter raised={campaign.raised} goal={campaign.goal} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyHint
              text="No campaigns yet."
              href="/admin/campaigns/new"
              action="Create the first one"
            />
          )}
        </section>
      </div>

      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between gap-3 border-b p-6">
          <div>
            <h2 className="text-lg font-semibold">Latest donations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatNumber(stats.activeCampaigns)} campaign
              {stats.activeCampaigns === 1 ? "" : "s"} currently live
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/donations">
              <Megaphone className="size-4" aria-hidden />
              All donations
            </Link>
          </Button>
        </div>

        {recent.length > 0 ? (
          <ul className="divide-y">
            {recent.map((donation) => (
              <li
                key={donation.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {publicDonorName(donation.donor_name, donation.is_anonymous)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {donation.campaign_title ?? "Where needed most"} ·{" "}
                    {formatDate(donation.created_at)}
                  </p>
                </div>
                <DonationStatusBadge status={donation.status} />
                <p className="w-24 text-right text-sm font-semibold tabular-nums">
                  {formatCurrency(donation.amount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <EmptyHint text="No donations recorded yet." href="/donate" action="Open the donation page" />
          </div>
        )}
      </section>
    </>
  );
}

function EmptyHint({
  text,
  href,
  action,
}: {
  text: string;
  href: string;
  action: string;
}) {
  return (
    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="text-primary underline-offset-4 hover:underline">
        {action}
      </Link>
    </p>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
