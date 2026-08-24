import "server-only";

import type { DonationFrequency, DonationStatus } from "@/types/database";

/**
 * Payment gateway seam — deliberately stubbed.
 *
 * Every donation currently lands as `pending` with a generated reference, which
 * is exactly the state a real gateway leaves it in between checkout and the
 * webhook confirming settlement. Admins settle them by hand from
 * /admin/donations for now.
 *
 * To go live, replace `createPayment` with a real gateway call and add a
 * webhook route that flips the matching donation to `completed` using the
 * service-role client in `lib/supabase/admin.ts`. Nothing else has to change.
 */

export type PaymentRequest = {
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  reference: string;
  donorEmail: string;
  donorName: string;
};

export type PaymentResult = {
  provider: string;
  paymentReference: string | null;
  status: DonationStatus;
  /** Where to send the donor next. A real gateway returns its checkout URL. */
  redirectUrl: string | null;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no look-alike characters

/** Human-quotable donation reference, e.g. `HF-7K2QM4`. */
export function generateReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const body = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `HF-${body}`;
}

export async function createPayment(request: PaymentRequest): Promise<PaymentResult> {
  // A live gateway would open a checkout session for `request` here and return
  // its hosted-payment URL as `redirectUrl`.
  void request;

  return {
    provider: "stub",
    paymentReference: null,
    status: "pending",
    redirectUrl: null,
  };
}

export const PAYMENTS_ARE_LIVE = false;
