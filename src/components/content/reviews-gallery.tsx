"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Star, Video, X } from "lucide-react";

import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import type { MediaType, Post } from "@/types/database";

export function ReviewsGallery({ posts, initialTab }: { posts: Post[]; initialTab: MediaType }) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const [tab, setTab] = useState<MediaType>(initialTab);
  const [open, setOpen] = useState<Post | null>(null);

  const media = posts.filter((p) => p.media_url && p.media_type);
  const shown = media.filter((p) => p.media_type === tab);
  const count = (t: MediaType) => media.filter((p) => p.media_type === t).length;

  function selectTab(t: MediaType) {
    setTab(t);
    // Keep the tab shareable (/reviews?tab=video) without a navigation.
    window.history.replaceState(null, "", t === "video" ? "?tab=video" : window.location.pathname);
  }

  return (
    <div className="section section-y space-y-8">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          <Star className="size-3.5 fill-amber-500 text-amber-600" />
          {fr ? "Témoignages" : "Testimonials"}
        </span>
        <h1 className="font-heading text-3xl font-bold text-emerald-950 sm:text-4xl dark:text-emerald-100">
          {fr ? "Avis de nos Donateurs & Bénéficiaires" : "Reviews from Donors & Families"}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {fr
            ? "Messages et vidéos de ceux qui soutiennent et reçoivent notre aide."
            : "Messages and videos from the people who support and receive our help."}
        </p>
      </header>

      <div role="tablist" className="flex items-center justify-center gap-3">
        {(
          [
            { t: "image", icon: Camera, label: fr ? "Avis Photos" : "Photo Reviews" },
            { t: "video", icon: Video, label: fr ? "Avis Vidéo" : "Video Reviews" },
          ] as const
        ).map(({ t, icon: Icon, label }) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => selectTab(t)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm",
              tab === t
                ? "border-emerald-800 bg-emerald-800 text-white shadow-md"
                : "border-emerald-900/10 bg-card text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/60",
            )}
          >
            <Icon className="size-4" />
            {label}
            <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 font-mono text-[11px]">{count(t)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mx-auto max-w-xl rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          {fr ? "Aucun avis pour le moment." : "No reviews here yet."}
        </p>
      ) : tab === "video" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <figure key={p.id} className="overflow-hidden rounded-xl border-2 border-emerald-900/10 bg-card">
              <video src={p.media_url!} controls playsInline preload="metadata" className="aspect-[9/16] max-h-[70vh] w-full bg-black object-contain" />
              {p.title && <figcaption className="p-3 text-sm font-medium">{p.title}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {shown.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(p)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border-2 border-emerald-900/10 bg-card text-left"
            >
              {/* Plain <img> so screenshots keep their natural height in the masonry. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.media_url!} alt={p.title || "Review"} loading="lazy" className="w-full" />
              {p.title && <span className="block p-2 text-xs font-medium">{p.title}</span>}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div className="relative h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image src={open.media_url!} alt={open.title || "Review"} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
