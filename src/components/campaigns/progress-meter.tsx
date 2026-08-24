import { cn } from "@/lib/utils";
import { formatCurrency, progressPercent } from "@/lib/format";

type Props = {
  raised: number;
  goal: number;
  className?: string;
  /** Hide the figures and show the bar alone — for dense list rows. */
  compact?: boolean;
};

/**
 * The single place a fundraising total is drawn. The bar is decorative; the
 * numbers beneath it carry the same information as text, so nothing depends on
 * colour or width alone.
 */
export function ProgressMeter({ raised, goal, className, compact }: Props) {
  const percent = progressPercent(raised, goal);
  const complete = percent >= 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatCurrency(raised)} raised of a ${formatCurrency(goal)} goal`}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            complete ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${Math.max(percent, 1.5)}%` }}
        />
      </div>

      {!compact && (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-foreground tabular-nums">
            {formatCurrency(raised)}
            <span className="ml-1.5 font-normal text-muted-foreground">
              of {formatCurrency(goal)}
            </span>
          </span>
          <span className="shrink-0 font-medium text-muted-foreground tabular-nums">
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
}
