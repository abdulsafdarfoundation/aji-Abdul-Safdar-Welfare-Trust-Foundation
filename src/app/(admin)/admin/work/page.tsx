import type { Metadata } from "next";

import { PostManager } from "@/components/admin/post-manager";
import { getPosts } from "@/lib/data/content";

export const metadata: Metadata = { title: "Work done" };

export default async function AdminWorkPage() {
  const posts = await getPosts("work");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Work done</h1>
        <p className="mt-1 text-sm text-muted-foreground">Photos and videos of completed work. Newest show first in the home page gallery.</p>
      </header>
      <PostManager kind="work" posts={posts} />
    </div>
  );
}
