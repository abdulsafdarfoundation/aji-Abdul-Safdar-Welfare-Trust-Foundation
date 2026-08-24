import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  /** Percentage change vs the previous period. Omit when there is no baseline. */
  changePct?: number | null;
};

export function StatCard({ label, value, hint, icon: Icon, changePct }: Props) {
  const hasChange = typeof changePct === "number" && Number.isFinite(changePct);
  const up = hasChange && changePct >= 0;
  const Trend = up ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>

      <p className="mt-3 font-heading text-3xl font-semibold tabular-nums">{value}</p>

      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {hasChange && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium tabular-nums",
              up ? "text-success" : "text-destructive",
            )}
          >
            <Trend className="size-3.5" aria-hidden />
            {up ? "+" : ""}
            {changePct}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
