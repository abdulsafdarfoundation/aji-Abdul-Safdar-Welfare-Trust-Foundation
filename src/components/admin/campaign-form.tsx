"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { Loader2 } from "lucide-react";

import type { CampaignFormState } from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CAMPAIGN_CATEGORIES, SITE } from "@/lib/constants";
import { slugify } from "@/lib/format";
import type { Campaign } from "@/types/database";

const STATUSES = [
  { value: "draft", label: "Draft — hidden from the site" },
  { value: "active", label: "Active — open for donations" },
  { value: "completed", label: "Completed — shown as funded" },
  { value: "archived", label: "Archived — hidden, kept for records" },
] as const;

export function CampaignForm({
  action,
  campaign,
  submitLabel,
}: {
  action: (state: CampaignFormState, formData: FormData) => Promise<CampaignFormState>;
  campaign?: Campaign;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<CampaignFormState, FormData>(
    action,
    null,
  );

  const [title, setTitle] = useState(campaign?.title ?? "");
  const [slug, setSlug] = useState(campaign?.slug ?? "");
  // Only auto-fill the slug for new campaigns — changing a live URL breaks
  // links people have already shared.
  const [slugLocked] = useState(!!campaign);

  const ids = {
    title: useId(),
    slug: useId(),
    summary: useId(),
    description: useId(),
    goal: useId(),
    cover: useId(),
    ends: useId(),
    featured: useId(),
  };

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6 rounded-xl border bg-card p-6">
          <div className="space-y-1.5">
            <Label htmlFor={ids.title}>Title</Label>
            <Input
              id={ids.title}
              name="title"
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugLocked) setSlug(slugify(event.target.value));
              }}
              aria-invalid={!!errors.title}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={ids.slug}>URL slug</Label>
            <div className="flex items-center gap-1 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
              <span className="shrink-0">/campaigns/</span>
              <Input
                id={ids.slug}
                name="slug"
                required
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                aria-invalid={!!errors.slug}
              />
            </div>
            <FieldError message={errors.slug} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={ids.summary}>Summary</Label>
            <Textarea
              id={ids.summary}
              name="summary"
              rows={2}
              maxLength={280}
              required
              defaultValue={campaign?.summary ?? ""}
              placeholder="One or two sentences — this is what shows on the campaign card."
              aria-invalid={!!errors.summary}
            />
            <FieldError message={errors.summary} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={ids.description}>Full description</Label>
            <Textarea
              id={ids.description}
              name="description"
              rows={14}
              defaultValue={campaign?.description ?? ""}
              className="font-mono text-[13px]"
              placeholder={
                "Blank lines separate paragraphs.\n\n**A bold line on its own becomes a heading.**\n\n- Lines starting with a dash become a bullet list"
              }
              aria-invalid={!!errors.description}
            />
            <p className="text-xs text-muted-foreground">
              Plain text. Blank lines make paragraphs, <code>**bold**</code> works inline,
              and a line starting with <code>-</code> becomes a bullet.
            </p>
            <FieldError message={errors.description} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="space-y-5 rounded-xl border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={campaign?.status ?? "draft"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                defaultValue={campaign?.category ?? CAMPAIGN_CATEGORIES[0]}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category} />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id={ids.featured}
                name="featured"
                defaultChecked={campaign?.featured}
                className="mt-0.5"
              />
              <Label htmlFor={ids.featured} className="text-sm leading-snug font-normal">
                Feature on the home page
              </Label>
            </div>
          </div>

          <div className="space-y-5 rounded-xl border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor={ids.goal}>Goal ({SITE.currency})</Label>
              <Input
                id={ids.goal}
                name="goalAmount"
                type="number"
                min={1}
                step="1"
                required
                defaultValue={campaign?.goal_amount ?? ""}
                aria-invalid={!!errors.goalAmount}
              />
              <FieldError message={errors.goalAmount} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={ids.ends}>End date</Label>
              <Input
                id={ids.ends}
                name="endsAt"
                type="date"
                defaultValue={campaign?.ends_at?.slice(0, 10) ?? ""}
              />
              <FieldError message={errors.endsAt} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={ids.cover}>Cover image URL</Label>
              <Input
                id={ids.cover}
                name="coverImageUrl"
                type="url"
                inputMode="url"
                placeholder="https://…"
                defaultValue={campaign?.cover_image_url ?? ""}
                aria-invalid={!!errors.coverImageUrl}
              />
              <p className="text-xs text-muted-foreground">
                Add the host to <code>images.remotePatterns</code> in{" "}
                <code>next.config.ts</code> first, or the image will not render.
              </p>
              <FieldError message={errors.coverImageUrl} />
            </div>
          </div>
        </aside>
      </div>

      {state?.formError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.formError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {submitLabel}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/campaigns">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
