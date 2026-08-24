import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";

import { updateCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/admin/campaign-form";
import { Button } from "@/components/ui/button";
import { getCampaignById } from "@/lib/data/campaigns";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/admin/campaigns/[id]">): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  return { title: campaign ? `Edit ${campaign.title}` : "Campaign not found" };
}

export default async function EditCampaignPage({
  params,
}: PageProps<"/admin/campaigns/[id]">) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) notFound();

  // Bind the id server-side so the client never gets to choose which row it edits.
  const action = updateCampaign.bind(null, campaign.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/campaigns"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Campaigns
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{campaign.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(campaign.raised_amount)} raised from{" "}
            {formatNumber(campaign.donation_count)} donation
            {campaign.donation_count === 1 ? "" : "s"} · last edited{" "}
            {formatDateTime(campaign.updated_at)}
          </p>
        </div>

        {campaign.status !== "draft" && (
          <Button asChild variant="outline">
            <Link href={`/campaigns/${campaign.slug}`} target="_blank">
              View public page
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </Button>
        )}
      </div>

      <CampaignForm action={action} campaign={campaign} submitLabel="Save changes" />
    </div>
  );
}
