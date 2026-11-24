import type { Metadata } from "next";

import { PostManager } from "@/components/admin/post-manager";
import { getPosts } from "@/lib/data/content";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const posts = await getPosts("review");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Photo and video reviews for the public Reviews page.</p>
      </header>
      <PostManager kind="review" posts={posts} />
    </div>
  );
}
