import type { Metadata } from "next";

import { CampaignCard } from "@/components/campaigns/campaign-card";
import { getPublicCampaigns } from "@/lib/data/campaigns";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Campaigns",
  description:
    "Every live and completed appeal, with what has been raised so far and what the money buys.",
};

export default async function CampaignsPage() {
  const campaigns = await getPublicCampaigns();
  const live = campaigns.filter((c) => c.status === "active");
  const funded = campaigns.filter((c) => c.status === "completed");
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised_amount, 0);

  return (
    <>
      <header className="border-b bg-accent/40">
        <div className="section py-14 sm:py-20">
          <h1 className="max-w-3xl text-4xl sm:text-5xl">Campaigns</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {live.length} appeal{live.length === 1 ? "" : "s"} open right now.{" "}
            {formatCurrency(totalRaised)} raised across every campaign we have run.
          </p>
        </div>
      </header>

      <div className="section section-y space-y-16">
        <section aria-labelledby="live-heading">
          <h2 id="live-heading" className="text-2xl">
            Open now
          </h2>
          {live.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              Nothing open at the moment — check back soon.
            </p>
          )}
        </section>

        {funded.length > 0 && (
          <section aria-labelledby="funded-heading">
            <h2 id="funded-heading" className="text-2xl">
              Fully funded
            </h2>
            <p className="mt-2 text-muted-foreground">
              Closed appeals, kept online so the numbers stay checkable.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {funded.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
