"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireStaff } from "@/lib/auth";
import { SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin mutations for site content. Files are uploaded by the browser straight
 * to the `media` Storage bucket (see components/admin/media-upload.ts); these
 * actions only record the resulting URLs.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

const DEMO_NOTICE = "Demo mode — connect Supabase to save content.";

const MEDIA_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/media/`;

const mediaSchema = z.object({
  url: z.string().refine((u) => u.startsWith(MEDIA_PREFIX), "Invalid media URL"),
  path: z.string().min(1).max(300),
  type: z.enum(["image", "video"]),
});

const postsSchema = z.object({
  kind: z.enum(["update", "work", "review"]),
  title: z.string().trim().max(200).default(""),
  body: z.string().trim().max(5000).default(""),
  media: z.array(mediaSchema).max(30).default([]),
});

export type CreatePostsInput = z.input<typeof postsSchema>;

const PATHS_BY_KIND = {
  update: ["/updates", "/admin/updates"],
  work: ["/", "/admin/work"],
  review: ["/reviews", "/admin/reviews"],
} as const;

function revalidateKind(kind: keyof typeof PATHS_BY_KIND) {
  for (const p of PATHS_BY_KIND[kind]) revalidatePath(p);
}

/** One row per uploaded file (or a single text-only row for an announcement). */
export async function createPosts(input: CreatePostsInput): Promise<ActionResult> {
  await requireStaff();

  const parsed = postsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { kind, title, body, media } = parsed.data;

  if (media.length === 0 && (kind !== "update" || (!title && !body))) {
    return {
      ok: false,
      error: kind === "update" ? "Add some text or a photo/video." : "Choose at least one photo or video.",
    };
  }

  if (!isSupabaseConfigured) return { ok: false, error: DEMO_NOTICE };

  const rows =
    media.length > 0
      ? media.map((m) => ({ kind, title, body, media_url: m.url, media_path: m.path, media_type: m.type }))
      : [{ kind, title, body }];

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(rows);
  if (error) return { ok: false, error: error.message };

  revalidateKind(kind);
  return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireStaff();
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_NOTICE };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("kind, media_path")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (data?.media_path) await supabase.storage.from("media").remove([data.media_path]);
  if (data) revalidateKind(data.kind);
  return { ok: true };
}

const causeSchema = z.object({
  titleEn: z.string().trim().min(2, "Enter a title").max(160),
  titleFr: z.string().trim().max(160).default(""),
  descriptionEn: z.string().trim().max(2000).default(""),
  descriptionFr: z.string().trim().max(2000).default(""),
  categoryEn: z.string().trim().max(80).default(""),
  categoryFr: z.string().trim().max(80).default(""),
  popular: z.boolean().default(false),
  image: mediaSchema.nullable().default(null),
});

export type CreateCauseInput = z.input<typeof causeSchema>;

export async function createCause(input: CreateCauseInput): Promise<ActionResult> {
  await requireStaff();

  const parsed = causeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_NOTICE };

  const c = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("causes").insert({
    title_en: c.titleEn,
    // French falls back to English so the FR site never shows a blank card.
    title_fr: c.titleFr || c.titleEn,
    description_en: c.descriptionEn,
    description_fr: c.descriptionFr || c.descriptionEn,
    category_en: c.categoryEn,
    category_fr: c.categoryFr || c.categoryEn,
    popular: c.popular,
    image_url: c.image?.url ?? null,
    image_path: c.image?.path ?? null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/donate");
  revalidatePath("/admin/causes");
  return { ok: true };
}

export async function deleteCause(id: string): Promise<ActionResult> {
  await requireStaff();
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_NOTICE };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("causes")
    .delete()
    .eq("id", id)
    .select("image_path")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (data?.image_path) await supabase.storage.from("media").remove([data.image_path]);

  revalidatePath("/");
  revalidatePath("/donate");
  revalidatePath("/admin/causes");
  return { ok: true };
}
