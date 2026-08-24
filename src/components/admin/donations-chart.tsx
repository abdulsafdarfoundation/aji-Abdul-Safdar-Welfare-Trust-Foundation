import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/format";
import type { MonthPoint } from "@/lib/data/stats";

/**
 * Monthly donation income. One series, so it carries one hue and no legend —
 * the heading names it. Hover reveals the exact figure per bar; the table
 * underneath carries the same numbers for screen readers and for anyone who
 * cannot read the bars.
 *
 * Pure CSS hover, no client JS: this stays a Server Component.
 */
export function DonationsChart({ data }: { data: MonthPoint[] }) {
  const max = Math.max(...data.map((point) => point.total), 1);
  const peak = data.reduce((best, point) => (point.total > best.total ? point : best), data[0]);

  return (
    <figure className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <figcaption className="text-sm text-muted-foreground">
          Completed donations per month
        </figcaption>
        <span className="text-xs text-muted-foreground tabular-nums">
          Peak {formatCompactCurrency(peak?.total ?? 0)}
        </span>
      </div>

      <div className="relative">
        {/* Recessive gridlines — three is enough to read height against. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40">
          {[0, 0.5, 1].map((fraction) => (
            <div
              key={fraction}
              className="absolute inset-x-0 border-t border-border/60"
              style={{ top: `${fraction * 100}%` }}
            />
          ))}
        </div>

        <ul className="relative flex h-40 items-end gap-[2px]">
          {data.map((point) => {
            const height = (point.total / max) * 100;
            return (
              <li key={point.iso} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-chart-1 transition-opacity group-hover:opacity-80"
                  style={{ height: `${Math.max(height, 1)}%` }}
                />
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-md border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-md group-hover:block"
                >
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(point.total)}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {formatNumber(point.count)} gifts
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <ul aria-hidden className="mt-2 flex gap-[2px]">
          {data.map((point) => (
            <li
              key={point.iso}
              className="flex-1 text-center text-xs text-muted-foreground"
            >
              {point.label}
            </li>
          ))}
        </ul>
      </div>

      <table className="sr-only">
        <caption>Completed donations per month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Total</th>
            <th scope="col">Donations</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.iso}>
              <th scope="row">{point.label}</th>
              <td>{formatCurrency(point.total)}</td>
              <td>{formatNumber(point.count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
