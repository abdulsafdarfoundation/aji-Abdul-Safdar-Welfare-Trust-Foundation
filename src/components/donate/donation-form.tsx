"use client";

import { useActionState, useId, useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";

import { submitDonation, type DonateState } from "@/app/actions/donate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DONATION_PRESETS, MIN_DONATION, SITE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type CampaignOption = { id: string; title: string; slug: string };

type Props = {
  campaigns: CampaignOption[];
  defaultCampaignId?: string;
  defaultFrequency?: "one_time" | "monthly";
};

export function DonationForm({
  campaigns,
  defaultCampaignId = "",
  defaultFrequency = "one_time",
}: Props) {
  const [state, formAction, isPending] = useActionState<DonateState, FormData>(
    submitDonation,
    null,
  );

  const [amount, setAmount] = useState<string>(String(DONATION_PRESETS[1]));
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [campaignId, setCampaignId] = useState(defaultCampaignId);

  const ids = {
    amount: useId(),
    name: useId(),
    email: useId(),
    phone: useId(),
    message: useId(),
    anon: useId(),
  };

  const errors = state?.errors ?? {};
  const numericAmount = Number(amount) || 0;

  return (
    <form action={formAction} className="space-y-8">
      {/* The action reads these; the visible controls above them are just UI. */}
      <input type="hidden" name="frequency" value={frequency} />
      <input type="hidden" name="campaignId" value={campaignId} />

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">How often?</legend>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          {(
            [
              { value: "one_time", label: "One-off gift" },
              { value: "monthly", label: "Monthly" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFrequency(option.value)}
              aria-pressed={frequency === option.value}
              className={cn(
                "rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                frequency === option.value
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">
          Amount <span className="font-normal text-muted-foreground">({SITE.currency})</span>
        </legend>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {DONATION_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(preset))}
              aria-pressed={numericAmount === preset}
              className={cn(
                "rounded-lg border py-2.5 text-sm font-semibold tabular-nums transition-colors",
                numericAmount === preset
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary/50 hover:bg-accent",
              )}
            >
              {formatCurrency(preset)}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={ids.amount}>Or enter another amount</Label>
          <Input
            id={ids.amount}
            name="amount"
            type="number"
            inputMode="decimal"
            min={MIN_DONATION}
            step="1"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? `${ids.amount}-error` : undefined}
          />
          <FieldError id={`${ids.amount}-error`} message={errors.amount} />
        </div>
      </fieldset>

      {campaigns.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">Where should it go?</legend>
          <div className="space-y-2">
            <CampaignChoice
              checked={campaignId === ""}
              onSelect={() => setCampaignId("")}
              title="Wherever it is needed most"
              hint="We direct it to the appeal with the biggest shortfall."
            />
            {campaigns.map((campaign) => (
              <CampaignChoice
                key={campaign.id}
                checked={campaignId === campaign.id}
                onSelect={() => setCampaignId(campaign.id)}
                title={campaign.title}
              />
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold">Your details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id={ids.name}
            name="donorName"
            label="Full name"
            autoComplete="name"
            required
            error={errors.donorName}
          />
          <Field
            id={ids.email}
            name="donorEmail"
            type="email"
            label="Email"
            autoComplete="email"
            required
            error={errors.donorEmail}
            hint="Your receipt goes here."
          />
        </div>

        <Field
          id={ids.phone}
          name="donorPhone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          optional
          error={errors.donorPhone}
        />

        <div className="space-y-1.5">
          <Label htmlFor={ids.message}>
            Message <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id={ids.message}
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Dedicate this gift, or tell the team something."
            aria-invalid={!!errors.message}
          />
          <FieldError id={`${ids.message}-error`} message={errors.message} />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox id={ids.anon} name="isAnonymous" className="mt-0.5" />
          <Label htmlFor={ids.anon} className="text-sm leading-snug font-normal">
            Give anonymously — hide my name from the public supporters list.
          </Label>
        </div>
      </fieldset>

      {state?.formError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.formError}
        </p>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Processing…
            </>
          ) : (
            <>
              <CreditCard className="size-4" aria-hidden />
              Give {formatCurrency(numericAmount)}
              {frequency === "monthly" ? " a month" : ""}
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          Payment processing is not connected yet — your pledge is recorded and our team
          will be in touch to complete it.
        </p>
      </div>
    </form>
  );
}

function CampaignChoice({
  checked,
  onSelect,
  title,
  hint,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
        checked ? "border-primary bg-primary/5" : "hover:bg-accent",
      )}
    >
      <input
        type="radio"
        name="campaignChoice"
        checked={checked}
        onChange={onSelect}
        className="mt-0.5 size-4 accent-[var(--primary)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

function Field({
  id,
  name,
  label,
  error,
  hint,
  optional,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-1 text-muted-foreground">(optional)</span>}
      </Label>
      <Input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
