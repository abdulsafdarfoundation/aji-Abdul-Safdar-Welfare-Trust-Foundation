"use client";

import Link from "next/link";
import { Mail, PhoneCall, Globe2 } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="mt-auto border-t bg-emerald-950 text-emerald-100">
      <div className="section grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Org Info */}
        <div className="space-y-4 lg:col-span-2">
          <Logo size="lg" className="text-white" />
          
          <p className="text-amber-300 text-base font-semibold leading-relaxed pt-2">
            {SITE.tagline[lang]}
          </p>
          <p className="max-w-md text-xs leading-relaxed text-emerald-200/80">
            {SITE.description[lang]}
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
              <Globe2 className="size-3.5" />
              France, Pakistan & USA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-medium">
              {lang === "fr" ? `Fondation enregistrée depuis ${SITE.since}` : `Registered Charity Since ${SITE.since}`}
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold tracking-wider text-amber-400 uppercase">
            {lang === "fr" ? "Nos Projets" : "Our Causes"}
          </h2>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#causes" className="text-emerald-200/80 hover:text-white transition-colors">
                {lang === "fr" ? "Pompes à Eau Solaires (Tharparkar)" : "Solar Drinking Water Pumps (Tharparkar)"}
              </Link>
            </li>
            <li>
              <Link href="/#causes" className="text-emerald-200/80 hover:text-white transition-colors">
                {lang === "fr" ? "Colis Alimentaires Mensuels" : "Monthly Ration Bags"}
              </Link>
            </li>
            <li>
              <Link href="/#causes" className="text-emerald-200/80 hover:text-white transition-colors">
                {lang === "fr" ? "Mariage de Filles Orphelines" : "Orphan Girls Marriage"}
              </Link>
            </li>
            <li>
              <Link href="/#causes" className="text-emerald-200/80 hover:text-white transition-colors">
                {lang === "fr" ? "Construction de Mosquées & Écoles" : "Mosque & Madrasa Construction"}
              </Link>
            </li>
            <li>
              <Link href="/#causes" className="text-emerald-200/80 hover:text-white transition-colors">
                {lang === "fr" ? "Repas Communautaires" : "Community Meal Distribution"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold tracking-wider text-amber-400 uppercase">
            {lang === "fr" ? "Contacts Directs" : "Direct Contacts"}
          </h2>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <PhoneCall className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-100">{SITE.contacts.france.name} (France)</p>
                <a href={SITE.contacts.france.whatsapp} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline">
                  {SITE.contacts.france.displayPhone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <PhoneCall className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-100">{SITE.contacts.pakistan.name} (PK)</p>
                <a href={SITE.contacts.pakistan.whatsapp} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline">
                  {SITE.contacts.pakistan.displayPhone}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2 pt-1 text-emerald-300">
              <Mail className="size-4 shrink-0 text-amber-400" />
              <span>{SITE.email}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-900 bg-emerald-950/80 py-6">
        <div className="section flex flex-col gap-4 text-xs text-emerald-300/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/donate" className="text-amber-300 hover:underline font-semibold">
              {lang === "fr" ? "Coordonnées Bancaires & IBAN" : "Bank Details & IBANs"}
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white">
              {lang === "fr" ? "À Propos de Nous" : "About Us"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


