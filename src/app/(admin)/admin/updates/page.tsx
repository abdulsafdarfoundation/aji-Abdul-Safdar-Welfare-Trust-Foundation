import type { Metadata } from "next";

import { PostManager } from "@/components/admin/post-manager";
import { getPosts } from "@/lib/data/content";

export const metadata: Metadata = { title: "Updates & announcements" };

export default async function AdminUpdatesPage() {
  const posts = await getPosts("update");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Updates & announcements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Posts appear on the public Updates page, newest first.</p>
      </header>
      <PostManager kind="update" posts={posts} />
    </div>
  );
}
