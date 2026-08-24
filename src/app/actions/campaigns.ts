"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaff } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { campaignSchema, fieldErrors } from "@/lib/validations";

export type CampaignFormState = {
  errors?: Record<string, string>;
  formError?: string;
} | null;

const DEMO_NOTICE =
  "Demo mode — connect Supabase in .env.local to save campaign changes.";

function readForm(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description") ?? "",
    category: formData.get("category"),
    goalAmount: formData.get("goalAmount"),
    status: formData.get("status") ?? "draft",
    featured: formData.get("featured") === "on",
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    endsAt: formData.get("endsAt") ?? "",
  };
}

function toRow(input: ReturnType<typeof campaignSchema.parse>) {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    description: input.description || null,
    category: input.category,
    goal_amount: input.goalAmount,
    status: input.status,
    featured: input.featured,
    cover_image_url: input.coverImageUrl || null,
    ends_at: input.endsAt ? new Date(input.endsAt).toISOString() : null,
  };
}

function revalidateCampaign(slug?: string) {
  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  revalidatePath("/");
  if (slug) revalidatePath(`/campaigns/${slug}`);
}

export async function createCampaign(
  _prev: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  await requireStaff();

  const parsed = campaignSchema.safeParse(readForm(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  if (!isSupabaseConfigured) return { formError: DEMO_NOTICE };

  const supabase = await createClient();
  const { error } = await supabase.from("campaigns").insert(toRow(parsed.data));

  if (error) {
    return {
      formError:
        error.code === "23505"
          ? "That slug is already taken — pick another."
          : error.message,
    };
  }

  revalidateCampaign(parsed.data.slug);
  redirect("/admin/campaigns");
}

export async function updateCampaign(
  id: string,
  _prev: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  await requireStaff();

  const parsed = campaignSchema.safeParse(readForm(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  if (!isSupabaseConfigured) return { formError: DEMO_NOTICE };

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    return {
      formError:
        error.code === "23505"
          ? "That slug is already taken — pick another."
          : error.message,
    };
  }

  revalidateCampaign(parsed.data.slug);
  redirect("/admin/campaigns");
}

export async function deleteCampaign(formData: FormData) {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.from("campaigns").delete().eq("id", id);
  }

  revalidateCampaign();
}
