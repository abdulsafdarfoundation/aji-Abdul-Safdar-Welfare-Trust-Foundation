import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";

import { deleteCampaign } from "@/app/actions/campaigns";
import { DeleteCampaignButton } from "@/components/admin/delete-campaign-button";
import { ProgressMeter } from "@/components/campaigns/progress-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllCampaigns } from "@/lib/data/campaigns";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { CampaignStatus } from "@/types/database";

export const metadata: Metadata = { title: "Campaigns" };

const STATUS_STYLES: Record<CampaignStatus, string> = {
  active: "border-success/30 bg-success/10 text-success",
  draft: "border-border bg-muted text-muted-foreground",
  completed: "border-primary/30 bg-primary/10 text-primary",
  archived: "border-border bg-muted text-muted-foreground line-through",
};

export default async function AdminCampaignsPage() {
  const campaigns = await getAllCampaigns();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatNumber(campaigns.length)} total ·{" "}
            {formatNumber(campaigns.filter((c) => c.status === "active").length)} live on
            the site
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new">
            <Plus className="size-4" aria-hidden />
            New campaign
          </Link>
        </Button>
      </header>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed p-16 text-center">
          <h2 className="font-semibold">No campaigns yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            A campaign is what donors give to. Create one as a draft, then flip it to
            active when the copy and budget are signed off.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin/campaigns/new">Create a campaign</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead className="w-56">Progress</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-28 text-right">Donors</TableHead>
                <TableHead className="w-32">Ends</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{campaign.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {campaign.category} · {formatCurrency(campaign.goal_amount)} goal
                        </p>
                      </div>
                      {campaign.featured && (
                        <Badge variant="secondary" className="shrink-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <ProgressMeter
                      raised={campaign.raised_amount}
                      goal={campaign.goal_amount}
                    />
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right tabular-nums">
                    {formatNumber(campaign.donor_count)}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {campaign.ends_at ? formatDate(campaign.ends_at) : "—"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {campaign.status !== "draft" && (
                        <Button asChild variant="ghost" size="icon" title="View public page">
                          <Link href={`/campaigns/${campaign.slug}`} target="_blank">
                            <ExternalLink className="size-4" />
                            <span className="sr-only">View {campaign.title}</span>
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon" title="Edit">
                        <Link href={`/admin/campaigns/${campaign.id}`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Edit {campaign.title}</span>
                        </Link>
                      </Button>
                      <DeleteCampaignButton
                        id={campaign.id}
                        title={campaign.title}
                        action={deleteCampaign}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
