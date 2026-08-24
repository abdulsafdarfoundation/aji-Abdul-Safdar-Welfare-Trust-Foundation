import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDonationByReference } from "@/lib/data/donations";
import { SITE } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }: PageProps<"/donate/thank-you">) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref : "";
  const donation = reference ? await getDonationByReference(reference) : null;

  return (
    <div className="section flex flex-col items-center py-20 text-center sm:py-28">
      <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="size-8" aria-hidden />
      </span>

      <h1 className="mt-6 text-4xl sm:text-5xl">Thank you.</h1>

      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        {donation
          ? `We have recorded your ${formatCurrency(donation.amount)} ${
              donation.frequency === "monthly" ? "monthly pledge" : "gift"
            }${donation.campaign_title ? ` to ${donation.campaign_title}` : ""}.`
          : "We have recorded your gift."}{" "}
        A member of the team will email you shortly to complete it.
      </p>

      {donation && (
        <dl className="mt-10 w-full max-w-md space-y-3 rounded-xl border bg-card p-6 text-left text-sm">
          <Row label="Reference" value={donation.reference} mono />
          <Separator />
          <Row label="Amount" value={formatCurrency(donation.amount, { cents: true })} />
          <Row
            label="Type"
            value={donation.frequency === "monthly" ? "Monthly" : "One-off"}
          />
          <Row label="Designation" value={donation.campaign_title ?? "Where needed most"} />
          <Row label="Received" value={formatDateTime(donation.created_at)} />
          <Separator />
          <Row label="Status" value="Awaiting payment confirmation" />
        </dl>
      )}

      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="size-4" aria-hidden />
        Questions? Write to{" "}
        <a href={`mailto:${SITE.email}`} className="text-primary underline-offset-4 hover:underline">
          {SITE.email}
        </a>
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/campaigns">See other campaigns</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono font-semibold" : "font-medium"}>{value}</dd>
    </div>
  );
}
