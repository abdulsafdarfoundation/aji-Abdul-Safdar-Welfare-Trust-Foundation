import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { updateDonationStatus } from "@/app/actions/donations-admin";
import { DonationFilters } from "@/components/admin/donation-filters";
import { DonationStatusBadge } from "@/components/admin/donation-status-badge";
import { DonationStatusMenu } from "@/components/admin/donation-status-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllCampaigns } from "@/lib/data/campaigns";
import { listDonations } from "@/lib/data/donations";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import type { DonationStatus } from "@/types/database";

export const metadata: Metadata = { title: "Donations" };

const PAGE_SIZE = 20;
const STATUSES: DonationStatus[] = ["pending", "completed", "failed", "refunded"];

export default async function AdminDonationsPage({
  searchParams,
}: PageProps<"/admin/donations">) {
  const params = await searchParams;

  const statusParam = typeof params.status === "string" ? params.status : "all";
  const status = STATUSES.includes(statusParam as DonationStatus)
    ? (statusParam as DonationStatus)
    : "all";
  const campaignId = typeof params.campaign === "string" ? params.campaign : "all";
  const search = typeof params.q === "string" ? params.q : "";
  const page = Math.max(1, Number(params.page) || 1);

  const campaigns = await getAllCampaigns();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Donations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every gift recorded, including pledges still waiting on payment.
        </p>
      </header>

      <DonationFilters
        campaigns={campaigns.map(({ id, title }) => ({ id, title }))}
      />

      <Suspense
        key={`${status}-${campaignId}-${search}-${page}`}
        fallback={<Skeleton className="h-96 rounded-xl" />}
      >
        <DonationsTable
          status={status}
          campaignId={campaignId}
          search={search}
          page={page}
          params={params}
        />
      </Suspense>
    </div>
  );
}

async function DonationsTable({
  status,
  campaignId,
  search,
  page,
  params,
}: {
  status: DonationStatus | "all";
  campaignId: string;
  search: string;
  page: number;
  params: Record<string, string | string[] | undefined>;
}) {
  const { rows, total, pageCount } = await listDonations({
    status,
    campaignId,
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const settled = rows
    .filter((row) => row.status === "completed")
    .reduce((sum, row) => sum + row.amount, 0);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-16 text-center">
        <h2 className="font-semibold">No donations match</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Try clearing the filters, or check the donation form on the public site.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead className="w-44">Campaign</TableHead>
              <TableHead className="w-28 text-right">Amount</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-44">Received</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{donation.donor_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {donation.donor_email} ·{" "}
                        <span className="font-mono">{donation.reference}</span>
                      </p>
                    </div>
                    {donation.is_anonymous && (
                      <Badge variant="outline" className="shrink-0">
                        Anon
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-sm">
                  {donation.campaign_title ?? (
                    <span className="text-muted-foreground">Where needed most</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(donation.amount)}
                  </span>
                  {donation.frequency === "monthly" && (
                    <span className="block text-xs text-muted-foreground">monthly</span>
                  )}
                </TableCell>

                <TableCell>
                  <DonationStatusBadge status={donation.status} />
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(donation.created_at)}
                </TableCell>

                <TableCell>
                  <DonationStatusMenu
                    id={donation.id}
                    reference={donation.reference}
                    current={donation.status}
                    action={updateDonationStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Showing {formatNumber(rows.length)} of {formatNumber(total)} ·{" "}
          {formatCurrency(settled)} settled on this page
        </p>

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="flex items-center gap-2">
            <PageLink params={params} page={page - 1} disabled={page <= 1}>
              Previous
            </PageLink>
            <span className="tabular-nums">
              Page {page} of {pageCount}
            </span>
            <PageLink params={params} page={page + 1} disabled={page >= pageCount}>
              Next
            </PageLink>
          </nav>
        )}
      </div>
    </>
  );
}

function PageLink({
  params,
  page,
  disabled,
  children,
}: {
  params: Record<string, string | string[] | undefined>;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled>
        {children}
      </Button>
    );
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && key !== "page") query.set(key, value);
  }
  query.set("page", String(page));

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/admin/donations?${query}`}>{children}</Link>
    </Button>
  );
}
