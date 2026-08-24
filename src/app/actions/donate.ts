"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { insertDonation } from "@/lib/data/donations";
import { SITE } from "@/lib/constants";
import { createPayment, generateReference, type PaymentResult } from "@/lib/payments";
import { donationSchema, fieldErrors } from "@/lib/validations";

export type DonateState = {
  errors?: Record<string, string>;
  formError?: string;
} | null;

export async function submitDonation(
  _prev: DonateState,
  formData: FormData,
): Promise<DonateState> {
  const parsed = donationSchema.safeParse({
    amount: formData.get("amount"),
    frequency: formData.get("frequency") ?? "one_time",
    campaignId: formData.get("campaignId") ?? "",
    donorName: formData.get("donorName"),
    donorEmail: formData.get("donorEmail"),
    donorPhone: formData.get("donorPhone") ?? "",
    message: formData.get("message") ?? "",
    isAnonymous: formData.get("isAnonymous") === "on",
  });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error) };
  }

  const input = parsed.data;
  const reference = generateReference();

  let payment: PaymentResult;
  try {
    payment = await createPayment({
      amount: input.amount,
      currency: SITE.currency,
      frequency: input.frequency,
      reference,
      donorEmail: input.donorEmail,
      donorName: input.donorName,
    });

    await insertDonation({
      reference,
      campaign_id: input.campaignId || null,
      donor_name: input.donorName,
      donor_email: input.donorEmail.toLowerCase(),
      donor_phone: input.donorPhone || null,
      amount: input.amount,
      currency: SITE.currency,
      frequency: input.frequency,
      status: payment.status,
      payment_provider: payment.provider,
      payment_reference: payment.paymentReference,
      message: input.message || null,
      is_anonymous: input.isAnonymous,
    });
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : "We could not record your donation. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/donations");

  // redirect() throws internally — it must sit outside the try/catch above,
  // or the catch would swallow it and show a spurious error.
  redirect(payment.redirectUrl ?? `/donate/thank-you?ref=${reference}`);
}
