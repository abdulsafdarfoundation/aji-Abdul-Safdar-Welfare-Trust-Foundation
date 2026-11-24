"use client";

import Image from "next/image";
import { Megaphone } from "lucide-react";

import { useLanguage } from "@/context/language-context";
import type { Post } from "@/types/database";

export function UpdatesFeed({ posts }: { posts: Post[] }) {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  return (
    <div className="section section-y space-y-10">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          <Megaphone className="size-3.5 text-amber-600" />
          {fr ? "Actualités & Annonces" : "News & Announcements"}
        </span>
        <h1 className="font-heading text-3xl font-bold text-emerald-950 sm:text-4xl dark:text-emerald-100">
          {fr ? "Dernières Nouvelles" : "Latest Updates"}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {fr
            ? "Suivez nos dernières actions, distributions et annonces sur le terrain."
            : "Follow our latest work, distributions and announcements from the field."}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mx-auto max-w-xl rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          {fr ? "Aucune actualité pour le moment." : "No updates yet — check back soon."}
        </p>
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border-2 border-emerald-900/10 bg-card shadow-sm"
            >
              {post.media_url && post.media_type === "image" && (
                <div className="relative aspect-[4/3] bg-emerald-950">
                  <Image
                    src={post.media_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-contain"
                  />
                </div>
              )}
              {post.media_url && post.media_type === "video" && (
                <video
                  src={post.media_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                />
              )}
              <div className="space-y-2 p-5 sm:p-6">
                <time dateTime={post.created_at} className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {new Date(post.created_at).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                {post.title && <h2 className="font-heading text-xl font-bold">{post.title}</h2>}
                {post.body && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{post.body}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
