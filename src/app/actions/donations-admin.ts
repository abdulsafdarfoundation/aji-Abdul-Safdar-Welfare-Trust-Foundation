"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { setDonationStatus } from "@/lib/data/donations";
import type { DonationStatus } from "@/types/database";

const VALID: DonationStatus[] = ["pending", "completed", "failed", "refunded"];

/**
 * Manual settlement. Until a real gateway webhook exists, an admin confirms
 * that money actually arrived — which is what moves a donation to `completed`
 * and rolls it into the campaign totals.
 */
export async function updateDonationStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as DonationStatus;

  if (!id || !VALID.includes(status)) return;

  await setDonationStatus(id, status);

  revalidatePath("/admin/donations");
  revalidatePath("/admin");
  revalidatePath("/campaigns");
}
