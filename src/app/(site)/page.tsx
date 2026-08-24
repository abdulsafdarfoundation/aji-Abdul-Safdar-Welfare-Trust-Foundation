"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldCheck, PhoneCall, Sparkles, Building2, Droplets, Utensils, Users, BookOpen, Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { CausePackagesGrid } from "@/components/causes/cause-packages";
import { BankAccountsHub } from "@/components/donate/bank-accounts";
import { WorkGallery } from "@/components/work/work-gallery";
import { useLanguage } from "@/context/language-context";

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        {/* Decorative background element */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15 pointer-events-none [background:radial-gradient(circle_at_20%_20%,#d4af37,transparent_50%),radial-gradient(circle_at_80%_80%,#0a4d3c,transparent_50%)]"
        />
        <div className="section relative py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Text & CTAs */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                <Sparkles className="size-3.5" />
                <span>
                  {lang === "fr"
                    ? `Fondation de Bienfaisance`
                    : `Welfare Trust & Foundation`}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                  {lang === "fr" ? "La Faim n'a pas de Religion." : "Hunger Has No Religion."}
                </h1>
                <h2 className="text-amber-300 text-2xl sm:text-3xl font-semibold leading-relaxed">
                  {SITE.tagline[lang]}
                </h2>
              </div>

              <p className="max-w-xl text-emerald-100/85 text-base sm:text-lg leading-relaxed">
                {SITE.description[lang]}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2 w-full">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg text-base h-12 px-6"
                >
                  <Link href="/donate" className="flex items-center gap-2">
                    <Heart className="size-5 fill-white/20" />
                    <span>{lang === "fr" ? "Coordonnées Bancaires & Dons" : "Bank Transfer & Donate Now"}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-700 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800 hover:text-white text-base h-12 px-6"
                >
                  <Link href="#causes">{lang === "fr" ? "Découvrir nos Projets" : "Explore All Appeals"}</Link>
                </Button>
              </div>

              {/* Direct WhatsApp Callouts */}
              <div className="pt-4 border-t border-emerald-900 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-xs text-emerald-200">
                <a
                  href={SITE.contacts.france.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <PhoneCall className="size-4 text-amber-400" />
                  <span>France: {SITE.contacts.france.displayPhone}</span>
                </a>
                <a
                  href={SITE.contacts.pakistan.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <PhoneCall className="size-4 text-amber-400" />
                  <span>Pakistan: {SITE.contacts.pakistan.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Official Logo & Ad Banner Card */}
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-emerald-900/40 p-6 shadow-2xl backdrop-blur-sm text-center space-y-4">
              <div className="relative mx-auto size-44 p-1">
                <Image
                  src="/logo/WhatsApp Image 2026-08-17 at 6.36.46 PM.jpeg"
                  alt="Haji Abdul Safdar Foundation Logo Emblem"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-xl text-white">
                  HAJI ABDUL SAFDAR
                </h3>
                <p className="text-amber-300 text-sm font-semibold">
                  Welfare Trust & Foundation
                </p>
                <p className="text-xs text-emerald-200/80">
                  Fondation de Confiance et de Bienfaisance France
                </p>
              </div>

              <div className="rounded-xl bg-emerald-950/80 p-3 text-xs text-amber-200 border border-amber-500/20 font-medium">
                ✨ {SITE.motto[lang]} ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cause Categories Quick Bar */}
      <section className="border-y bg-emerald-900/5 dark:bg-emerald-950/40">
        <div className="section grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 md:grid-cols-6 text-center">
          <FeatureIcon icon={Droplets} title={lang === "fr" ? "Pompes à Eau" : "Solar Water Pumps"} />
          <FeatureIcon icon={Utensils} title={lang === "fr" ? "Repas Gratuit" : "Free Meals"} />
          <FeatureIcon icon={Gift} title={lang === "fr" ? "Rations Mensuelles" : "Monthly Ration"} />
          <FeatureIcon icon={Users} title={lang === "fr" ? "Aide aux Mariages" : "Orphan Marriages"} />
          <FeatureIcon icon={Building2} title={lang === "fr" ? "Mosquées & Écoles" : "Mosque Building"} />
          <FeatureIcon icon={BookOpen} title={lang === "fr" ? "Éducation Orphelins" : "Orphan Education"} />
        </div>
      </section>

      {/* Core Causes & Pricing Tiers */}
      <section className="section section-y">
        <CausePackagesGrid />
      </section>

      {/* Direct Bank Accounts & Transfer Hub */}
      <section className="border-t bg-emerald-950/5 dark:bg-emerald-950/20 py-16">
        <div className="section">
          <BankAccountsHub />
        </div>
      </section>

      {/* Work Done Gallery */}
      <section className="section section-y border-t">
        <WorkGallery />
      </section>

      {/* Closing Call to Action Banner */}
      <section className="section section-y">
        <div className="overflow-hidden rounded-3xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 sm:p-14 shadow-xl">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="size-4" /> {lang === "fr" ? "100% Transparence & Action Directe" : "100% Transparent Relief"}
              </span>
              <h2 className="text-3xl font-heading font-bold sm:text-4xl text-white">
                {lang === "fr"
                  ? "Unissez-vous à nous pour Servir l'Humanité"
                  : "Join Us in Serving Humanity & Honoring Loved Ones"}
              </h2>
              <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xl">
                {lang === "fr"
                  ? "Faites un don de Zakat ou Sadqah pour soutenir les familles démunies, installer des pompes d'eau potable solaires ou offrir des repas chauds au Pakistan."
                  : "Donate Zakat, Sadqah, Fitrana or General Charity to support families, build drinking water pumps, or feed orphans in rural Sindh & Pakistan."}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base h-12"
              >
                <Link href="/donate">{lang === "fr" ? "Voir les Coordonnées Bancaires" : "Get Bank Transfer Details"}</Link>
              </Button>
              <a
                href={SITE.contacts.france.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-900/60 px-4 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-800 hover:text-white transition-colors"
              >
                <PhoneCall className="size-4 text-amber-400" />
                <span>{lang === "fr" ? "Contacter M. Haji Abdul Safdar" : "Contact Mr. Haji Abdul Safdar"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureIcon({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 space-y-1.5 rounded-xl transition-all hover:bg-white dark:hover:bg-emerald-900/40 hover:shadow-xs">
      <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/40">
        <Icon className="size-5" />
      </span>
      <span className="text-xs font-semibold text-foreground">{title}</span>
    </div>
  );
}


