import type { Metadata } from "next";

import { ReviewsGallery } from "@/components/content/reviews-gallery";
import { getPosts } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Photo and video reviews from our donors and the families we support.",
};

export default async function ReviewsPage({ searchParams }: PageProps<"/reviews">) {
  const { tab } = await searchParams;
  const posts = await getPosts("review");
  return <ReviewsGallery posts={posts} initialTab={tab === "video" ? "video" : "image"} />;
}
