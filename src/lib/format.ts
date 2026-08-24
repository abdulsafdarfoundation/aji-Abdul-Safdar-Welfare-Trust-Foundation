import { SITE } from "./constants";

/** `$1,250` — whole units by default, since donations rarely need cents. */
export function formatCurrency(
  amount: number,
  { currency = SITE.currency, cents = false } = {},
) {
  return new Intl.NumberFormat(SITE.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(amount);
}

/** `$1.2k` / `$1.4M` — for stat tiles where width is tight. */
export function formatCompactCurrency(amount: number, currency = SITE.currency) {
  return new Intl.NumberFormat(SITE.locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(SITE.locale).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Clamped to 100 so an over-funded campaign does not overflow its bar. */
export function progressPercent(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function daysLeft(endsAt: string | null): number | null {
  if (!endsAt) return null;
  const ms = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

/** "Sarah M." — how a donor is shown publicly unless they chose anonymity. */
export function publicDonorName(name: string, isAnonymous: boolean) {
  if (isAnonymous) return "Anonymous";
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
