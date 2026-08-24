"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { CAUSE_PACKAGES, CausePackage } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function CausePackagesGrid({ limit }: { limit?: number }) {
  const packages = limit ? CAUSE_PACKAGES.slice(0, limit) : CAUSE_PACKAGES;
  const { lang } = useLanguage();

  return (
    <div className="space-y-8" id="causes">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-amber-600" />
            {lang === "fr" ? "Nos Projets & Appels Principaux" : "Key Appeals & Programs"}
          </span>
          <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl">
            {lang === "fr"
              ? "Où vos Dons ont un Impact Direct"
              : "Where Your Donations Make a Direct Impact"}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {lang === "fr"
              ? "Soutenez des personnes démunies en hommage à vos proches et pour la cause humaine."
              : "Support deserving individuals for the sake of the reward for yourself and your loved ones."}
          </p>
        </div>

        {limit && (
          <Button asChild variant="outline" className="border-emerald-800/30 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-950">
            <Link href="/#causes" className="flex items-center gap-2">
              <span>{lang === "fr" ? "Voir les 6 Projets" : "View All 6 Appeals"}</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <CauseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function CauseCard({ item }: { item: CausePackage }) {
  const { lang } = useLanguage();
  const title = lang === "fr" ? item.titleFr : item.titleEn;
  const description = lang === "fr" ? item.descriptionFr : item.descriptionEn;
  const category = lang === "fr" ? item.categoryFr : item.categoryEn;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-emerald-900/10 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-700/30">
      {/* Badge for popular */}
      {item.popular && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-md">
          {lang === "fr" ? "Besoin Urgent" : "Urgent Need"}
        </div>
      )}

      {/* Image Preview */}
      <div className="relative h-52 w-full overflow-hidden bg-emerald-950/10">
        <Image
          src={item.image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Pricing overlay tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="rounded-md bg-emerald-900/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold">
            {category}
          </span>
          <div className="text-right">
            <span className="text-xl font-extrabold text-amber-300 drop-shadow-sm font-mono">
              €{item.priceEuro}
            </span>
            <span className="text-[11px] text-emerald-100/90 block font-mono">
              (Approx Rs. {item.pricePkr.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-bold text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t space-y-3">
          <Button
            asChild
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs h-10 shadow-sm"
          >
            <Link href={`/donate?cause=${item.id}`} className="flex items-center justify-center gap-2">
              <Heart className="size-3.5 fill-white/20 text-white" />
              <span>{lang === "fr" ? "Soutenir ce Projet" : "Sponsor This Cause"}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

