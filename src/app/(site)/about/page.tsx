"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/context/language-context";

const TEAM = [
  {
    name: "Mr. Haji Abdul Safdar",
    roleEn: "Founder & Head (France / Europe)",
    roleFr: "Fondateur et Dirigeant (France / Europe)",
    phone: SITE.contacts.france.displayPhone,
    whatsapp: SITE.contacts.france.whatsapp,
    flag: "🇫🇷",
  },
  {
    name: "Hafiz Fayyaz Ahmed (Fiaz Ahmad)",
    roleEn: "Field Director & Pakistan Coordinator",
    roleFr: "Directeur de Terrain & Coordinateur Pakistan",
    phone: SITE.contacts.pakistan.displayPhone,
    whatsapp: SITE.contacts.pakistan.whatsapp,
    flag: "🇵🇰",
  },
  {
    name: "Asad",
    roleEn: "United States Representative",
    roleFr: "Représentant aux États-Unis",
    phone: SITE.contacts.usa.displayPhone,
    whatsapp: `https://wa.me/15516890350`,
    flag: "🇺🇸",
  },
] as const;

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <>
      {/* Header */}
      <header className="border-b bg-emerald-950 text-white py-16 sm:py-20">
        <div className="section">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
              {lang === "fr" ? `Fondation Depuis ${SITE.since}` : `Foundation Since ${SITE.since}`}
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-tight">
              {lang === "fr" ? "À Propos de la Fondation Haji Abdul Safdar" : "About Haji Abdul Safdar Foundation"}
            </h1>
            <h2 className="text-amber-300 text-xl font-semibold">
              {SITE.name} (France)
            </h2>
            <p className="text-emerald-100/90 text-lg leading-relaxed pt-2">
              {lang === "fr"
                ? "Dédiée au service de l'humanité avec dignité, transparence et amour depuis 2023. Notre mission repose sur ce principe universel :"
                : "Dedicated to serving humanity with dignity, transparency, and love since 2023. Our mission is built on the universal principle:"}{" "}
              <strong className="text-amber-300 font-semibold">
                "{SITE.tagline[lang]}"
              </strong>
            </p>
          </div>
        </div>
      </header>

      {/* Main Mission & Values */}
      <section className="section section-y grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 text-foreground">
          <div className="space-y-2">
            <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">
              {lang === "fr" ? "Notre Vision Principale" : "Our Core Vision"}
            </span>
            <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100">
              {lang === "fr" ? "Servir l'Humanité Sans Frontières" : "Serving Humanity Across Borders"}
            </h2>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {lang === "fr"
              ? "La Fondation et Trust Haji Abdul Safdar a été créée en France en 2023 dans le but d'apporter un soulagement aux familles démunies, orphelins et villages isolés au Pakistan (notamment à Tharparkar Sindh)."
              : "Haji Abdul Safdar Welfare Trust & Foundation was established in France in 2023 with a mission to bring relief to underprivileged families, orphans, and remote communities in Pakistan (specifically Sindh and rural villages)."}
          </p>

          <div className="space-y-4">
            <div className="flex gap-3 text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">1</span>
              <div>
                <strong className="block text-foreground font-semibold">
                  {lang === "fr" ? "Eau Potable à Tharparkar (Sindh) :" : "Clean Water in Tharparkar (Sindh):"}
                </strong>
                <span className="text-muted-foreground text-xs">
                  {lang === "fr"
                    ? "Installation de pompes à eau solaires profondes pour offrir de l'eau potable durable dans les zones désertiques."
                    : "Installing solar-powered deep water pumps to provide sustainable drinking water in drought-affected desert areas."}
                </span>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">2</span>
              <div>
                <strong className="block text-foreground font-semibold">
                  {lang === "fr" ? "Soutien Alimentaire Mensuel :" : "Monthly Food & Ration Support:"}
                </strong>
                <span className="text-muted-foreground text-xs">
                  {lang === "fr"
                    ? "Distribution mensuelle de colis alimentaires de première nécessité aux veuves et familles nécessiteuses."
                    : "Distributing monthly ration packs to vulnerable widows, needy families, and hosting free community meals."}
                </span>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">3</span>
              <div>
                <strong className="block text-foreground font-semibold">
                  {lang === "fr" ? "Mariage d'Orphelines et Éducation :" : "Orphan Marriage & Education:"}
                </strong>
                <span className="text-muted-foreground text-xs">
                  {lang === "fr"
                    ? "Offrir des cadeaux de mariage essentiels et un soutien éducatif aux enfants orphelins."
                    : "Providing dowry and essential marriage gifts for orphan girls, along with educational support."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Card */}
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-800/20 bg-card p-8 shadow-xl text-center space-y-6 max-w-sm">
            <div className="relative mx-auto size-48 overflow-hidden rounded-full border-4 border-amber-500 bg-emerald-950 p-1 shadow-md">
              <Image
                src="/logo/WhatsApp Image 2026-08-17 at 6.36.46 PM.jpeg"
                alt="Foundation Logo"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-foreground">
                Haji Abdul Safdar Foundation
              </h3>
              <p className="text-amber-700 dark:text-amber-400 font-semibold text-sm">
                {SITE.motto[lang]}
              </p>
            </div>
            <div className="pt-2 text-xs text-muted-foreground border-t">
              Fondation de Confiance et de Bienfaisance France
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="border-t bg-emerald-950/5 dark:bg-emerald-950/20 py-16">
        <div className="section space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">
              {lang === "fr" ? "Direction & Représentants" : "Leadership & Representatives"}
            </span>
            <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100">
              {lang === "fr" ? "Les Dirigeants de Notre Mission" : "Who Leads Our Mission"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {TEAM.map((person) => (
              <div key={person.name} className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{person.flag}</span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold px-2 py-0.5 uppercase">
                      {lang === "fr" ? "Vérifié" : "Verified Leader"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{person.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {lang === "fr" ? person.roleFr : person.roleEn}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <a
                    href={person.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs py-2 px-3 transition-colors"
                  >
                    <PhoneCall className="size-3.5" />
                    <span>Contact {person.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-y text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            {lang === "fr" ? "Prêt à Contribuer ?" : "Ready to contribute?"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {lang === "fr"
              ? "Obtenez nos coordonnées bancaires vérifiées en France, au Pakistan ou aux USA et effectuez directement votre don."
              : "Get our verified bank accounts in France, Pakistan, or the USA and transfer your Zakat or Sadqah directly."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
              <Link href="/donate">{lang === "fr" ? "Voir les Coordonnées Bancaires" : "View Bank Details"}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#causes">{lang === "fr" ? "Découvrir tous les Projets" : "Browse All Appeals"}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}


