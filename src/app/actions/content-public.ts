"use server";

import { getCauses, getPosts } from "@/lib/data/content";
import type { CausePackage } from "@/lib/constants";

/**
 * Read-only actions for the client-rendered home and donate pages, mirroring
 * the existing `getGalleryMedia` pattern. Everything returned here is public.
 */

/** Admin-added causes mapped to the same shape as the built-in ones. */
export async function getDynamicCauses(): Promise<CausePackage[]> {
  const causes = await getCauses();
  return causes.map((c) => ({
    id: c.id,
    titleEn: c.title_en,
    titleFr: c.title_fr || c.title_en,
    descriptionEn: c.description_en,
    descriptionFr: c.description_fr || c.description_en,
    categoryEn: c.category_en,
    categoryFr: c.category_fr || c.category_en,
    image: c.image_url ?? "/ads/Appeals/Monthly Rashan.jpeg",
    priceEuro: 0,
    pricePkr: 0,
    popular: c.popular,
  }));
}

export async function getWorkMedia() {
  const posts = await getPosts("work");
  return posts
    .filter((p) => p.media_url && p.media_type)
    .map((p) => ({
      src: p.media_url!,
      type: p.media_type!,
      titleEn: p.title || (p.media_type === "video" ? "Field Action (Video)" : "Field Work"),
      titleFr: p.title || (p.media_type === "video" ? "Action (Vidéo)" : "Action sur le Terrain"),
      categoryEn: "All",
      categoryFr: "Toutes les Actions",
    }));
}
