import type { Metadata } from "next";

import { UpdatesFeed } from "@/components/content/updates-feed";
import { getPosts } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Updates & Announcements",
  description: "Latest news, distributions and announcements from the field.",
};

// Admin changes revalidate this page immediately; this is only a safety net.
export const revalidate = 300;

export default async function UpdatesPage() {
  const posts = await getPosts("update");
  return <UpdatesFeed posts={posts} />;
}
