import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ProgressMeter } from "@/components/campaigns/progress-meter";
import { daysLeft, formatNumber } from "@/lib/format";
import type { Campaign } from "@/types/database";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const remaining = daysLeft(campaign.ends_at);
  const isComplete = campaign.status === "completed";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="relative aspect-[16/10] overflow-hidden bg-accent">
        {campaign.cover_image_url ? (
          <Image
            src={campaign.cover_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback seed={campaign.slug} />
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-sm">
            {campaign.category}
          </Badge>
          {isComplete && <Badge className="bg-success text-white">Funded</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg leading-snug font-semibold">
            <Link
              href={`/campaigns/${campaign.slug}`}
              className="after:absolute after:inset-0 hover:text-primary focus-visible:outline-none"
            >
              {campaign.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{campaign.summary}</p>
        </div>

        <div className="mt-auto space-y-3">
          <ProgressMeter raised={campaign.raised_amount} goal={campaign.goal_amount} />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              {formatNumber(campaign.donor_count)} donors
            </span>
            {remaining !== null && !isComplete && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-3.5" aria-hidden />
                {remaining === 0 ? "Final day" : `${remaining} days left`}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Deterministic placeholder art so a campaign without a cover photo still gets
 * a distinct card. Derived from the slug, so it never changes under a campaign.
 */
function CoverFallback({ seed }: { seed: string }) {
  const hash = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rotate = hash % 60;

  return (
    <div
      className="size-full bg-gradient-to-br from-primary/85 via-primary/60 to-brand/50"
      style={{ backgroundPosition: `${rotate}% 50%` }}
      aria-hidden
    >
      <svg className="size-full opacity-25" viewBox="0 0 400 250" preserveAspectRatio="none">
        <path
          d={`M0 ${140 + (hash % 40)} Q100 ${90 + (hash % 60)} 200 ${130 + (hash % 30)} T400 ${110 + (hash % 50)} V250 H0 Z`}
          fill="white"
        />
        <path
          d={`M0 ${180 + (hash % 30)} Q120 ${140 + (hash % 40)} 240 ${175 + (hash % 25)} T400 ${160 + (hash % 35)} V250 H0 Z`}
          fill="white"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
