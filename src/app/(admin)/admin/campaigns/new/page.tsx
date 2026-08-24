import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { createCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/admin/campaign-form";

export const metadata: Metadata = { title: "New campaign" };

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Campaigns
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saves as a draft unless you set the status to active.
        </p>
      </div>

      <CampaignForm action={createCampaign} submitLabel="Create campaign" />
    </div>
  );
}
