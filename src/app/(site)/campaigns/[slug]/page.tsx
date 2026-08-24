import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Quote, Users } from "lucide-react";

import { ProgressMeter } from "@/components/campaigns/progress-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCampaignBySlug } from "@/lib/data/campaigns";
import { getCampaignSupporters } from "@/lib/data/donations";
import {
  daysLeft,
  formatCurrency,
  formatDate,
  formatNumber,
  initialsOf,
  publicDonorName,
} from "@/lib/format";

// Deliberately no generateStaticParams: once Supabase is connected the data
// layer reads cookies for RLS, which is not available at build time. Campaign
// pages render per request instead.

export async function generateMetadata({
  params,
}: PageProps<"/campaigns/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: "Campaign not found" };

  return {
    title: campaign.title,
    description: campaign.summary,
    openGraph: {
      title: campaign.title,
      description: campaign.summary,
      images: campaign.cover_image_url ? [campaign.cover_image_url] : undefined,
    },
  };
}

export default async function CampaignPage({ params }: PageProps<"/campaigns/[slug]">) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  // Drafts and archived campaigns are not public, even by direct link.
  if (!campaign || campaign.status === "draft" || campaign.status === "archived") {
    notFound();
  }

  const supporters = await getCampaignSupporters(campaign.id);
  const remaining = daysLeft(campaign.ends_at);
  const isComplete = campaign.status === "completed";

  return (
    <article>
      <header className="border-b bg-accent/40">
        <div className="section py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{campaign.category}</Badge>
            {isComplete && <Badge className="bg-success text-white">Fully funded</Badge>}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">{campaign.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{campaign.summary}</p>
        </div>
      </header>

      <div className="section section-y grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-8">
          {campaign.cover_image_url && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border">
              <Image
                src={campaign.cover_image_url}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
            </div>
          )}

          <Description text={campaign.description} />

          {supporters.length > 0 && (
            <section aria-labelledby="supporters" className="space-y-4">
              <Separator />
              <h2 id="supporters" className="text-2xl">
                Recent supporters
              </h2>
              <ul className="space-y-3">
                {supporters.map((donation) => {
                  const name = publicDonorName(donation.donor_name, donation.is_anonymous);
                  return (
                    <li key={donation.id} className="flex gap-3 rounded-lg border bg-card p-4">
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                      >
                        {donation.is_anonymous ? "?" : initialsOf(donation.donor_name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            gave {formatCurrency(donation.amount)} ·{" "}
                            {formatDate(donation.created_at)}
                          </span>
                        </p>
                        {donation.message && (
                          <p className="mt-1.5 flex gap-1.5 text-sm text-muted-foreground italic">
                            <Quote className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                            {donation.message}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-xl border bg-card p-6 shadow-xs">
            <ProgressMeter raised={campaign.raised_amount} goal={campaign.goal_amount} />

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Donors</dt>
                <dd className="mt-0.5 inline-flex items-center gap-1.5 font-semibold tabular-nums">
                  <Users className="size-4 text-muted-foreground" aria-hidden />
                  {formatNumber(campaign.donor_count)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  {isComplete ? "Closed" : "Time left"}
                </dt>
                <dd className="mt-0.5 inline-flex items-center gap-1.5 font-semibold tabular-nums">
                  <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
                  {isComplete
                    ? campaign.ends_at
                      ? formatDate(campaign.ends_at)
                      : "—"
                    : remaining !== null
                      ? `${remaining} days`
                      : "Ongoing"}
                </dd>
              </div>
            </dl>

            {isComplete ? (
              <div className="rounded-lg bg-success/10 p-4 text-sm text-foreground">
                This campaign reached its goal. Thank you to everyone who gave — support
                another open appeal below.
              </div>
            ) : (
              <Button
                asChild
                size="lg"
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <Link href={`/donate?campaign=${campaign.slug}`}>
                  Donate to this campaign
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/campaigns">Browse all campaigns</Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}

/**
 * Campaign copy is stored as plain text with blank-line paragraphs and simple
 * `**bold**` / `- bullet` markers — enough structure for staff without shipping
 * a markdown parser or opening an XSS hole via dangerouslySetInnerHTML.
 */
function Description({ text }: { text: string | null }) {
  if (!text) return null;

  const blocks = text.split(/\n{2,}/);

  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((block, index) => {
        const lines = block.split("\n");

        if (lines.every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={index} className="ml-5 list-disc space-y-1.5 marker:text-primary">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.replace(/^\s*-\s*/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (/^\*\*.+\*\*$/.test(block.trim())) {
          return (
            <h2 key={index} className="pt-2 text-2xl">
              {block.trim().replace(/\*\*/g, "")}
            </h2>
          );
        }

        return <p key={index}>{inline(block)}</p>;
      })}
    </div>
  );
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
