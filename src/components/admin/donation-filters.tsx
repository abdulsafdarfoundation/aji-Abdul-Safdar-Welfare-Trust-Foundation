"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
] as const;

/**
 * Filters live in the URL, so a filtered view is shareable and the back button
 * behaves. Every change resets to page 1 — otherwise you land on page 4 of a
 * two-page result.
 */
export function DonationFilters({
  campaigns,
}: {
  campaigns: { id: string; title: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function apply(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }));
  }

  const status = searchParams.get("status") ?? "all";
  const campaign = searchParams.get("campaign") ?? "all";
  const search = searchParams.get("q") ?? "";
  const isFiltered = status !== "all" || campaign !== "all" || search !== "";

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("q");
        apply({ q: String(value ?? "") });
      }}
    >
      <div className="min-w-56 flex-1 space-y-1.5">
        <Label htmlFor="donation-search">Search</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="donation-search"
            name="q"
            defaultValue={search}
            placeholder="Name, email or reference"
            className="pl-9"
          />
        </div>
      </div>

      <div className="w-44 space-y-1.5">
        <Label htmlFor="donation-status">Status</Label>
        <Select value={status} onValueChange={(value) => apply({ status: value })}>
          <SelectTrigger id="donation-status" className="w-full">
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

      <div className="w-56 space-y-1.5">
        <Label htmlFor="donation-campaign">Campaign</Label>
        <Select value={campaign} onValueChange={(value) => apply({ campaign: value })}>
          <SelectTrigger id="donation-campaign" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All campaigns</SelectItem>
            {campaigns.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" variant="secondary" disabled={isPending}>
        Apply
      </Button>

      {isFiltered && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
        >
          Clear
        </Button>
      )}
    </form>
  );
}
