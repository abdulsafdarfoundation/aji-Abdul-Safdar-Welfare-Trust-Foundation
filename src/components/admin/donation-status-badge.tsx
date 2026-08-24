import { CircleAlert, CircleCheck, CircleDashed, Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DonationStatus } from "@/types/database";

/**
 * Status is reserved colour — it never doubles as a series hue, and it always
 * ships with an icon and a word so the state is never colour-alone.
 */
const STYLES: Record<
  DonationStatus,
  { label: string; icon: typeof CircleCheck; className: string }
> = {
  completed: {
    label: "Completed",
    icon: CircleCheck,
    className: "border-success/30 bg-success/10 text-success",
  },
  pending: {
    label: "Pending",
    icon: CircleDashed,
    className: "border-warning/40 bg-warning/10 text-foreground",
  },
  failed: {
    label: "Failed",
    icon: CircleAlert,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  refunded: {
    label: "Refunded",
    icon: Undo2,
    className: "border-border bg-muted text-muted-foreground",
  },
};

export function DonationStatusBadge({ status }: { status: DonationStatus }) {
  const { label, icon: Icon, className } = STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
