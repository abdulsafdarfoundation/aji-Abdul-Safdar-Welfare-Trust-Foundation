import type { Metadata } from "next";
import { CircleCheck, CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { requireStaff } from "@/lib/auth";
import { DONATION_PRESETS, SITE } from "@/lib/constants";
import { PAYMENTS_ARE_LIVE } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await requireStaff();

  const checks = [
    {
      label: "Supabase connection",
      ok: isSupabaseConfigured,
      detail: isSupabaseConfigured
        ? "Connected — reading and writing live data."
        : "Not configured. The site is serving fixtures from src/lib/data/demo.ts.",
    },
    {
      label: "Payment gateway",
      ok: PAYMENTS_ARE_LIVE,
      detail: PAYMENTS_ARE_LIVE
        ? "Live — donations settle automatically."
        : "Stubbed. Donations are saved as pending and confirmed by hand from the Donations page.",
    },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What is wired up, and where to change the rest.
        </p>
      </header>

      <section className="rounded-xl border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">System status</h2>
        </div>
        <Separator />
        <ul className="divide-y">
          {checks.map((check) => (
            <li key={check.label} className="flex gap-4 p-6">
              {check.ok ? (
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
              ) : (
                <CircleX className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
              )}
              <div className="min-w-0">
                <p className="font-medium">{check.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Your account</h2>
        </div>
        <Separator />
        <dl className="divide-y">
          <Row label="Name" value={profile.full_name ?? "—"} />
          <Row label="Email" value={profile.email} />
          <Row
            label="Role"
            value={
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
            }
          />
          <Row label="Member since" value={formatDate(profile.created_at)} />
        </dl>
        <Separator />
        <p className="p-6 text-sm text-muted-foreground">
          Roles are managed in the <code>profiles</code> table. Only an admin can change
          one — a database trigger rejects the update otherwise.
        </p>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Organisation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These come from <code>src/lib/constants.ts</code> — edit that file and every
            page follows.
          </p>
        </div>
        <Separator />
        <dl className="divide-y">
          <Row label="Name" value={SITE.name} />
          <Row label="Contact email" value={SITE.email} />
          <Row label="Currency" value={SITE.currency} />
          <Row
            label="Donation presets"
            value={DONATION_PRESETS.map((amount) => formatCurrency(amount)).join(" · ")}
          />
        </dl>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
