"use client";

import { useSearchParams } from "next/navigation";
import { BadgeCheck, PhoneCall, ShieldCheck, Heart } from "lucide-react";

import { SITE, CAUSE_PACKAGES } from "@/lib/constants";
import { BankAccountsHub } from "@/components/donate/bank-accounts";
import { useLanguage } from "@/context/language-context";

export default function DonatePage() {
  const searchParams = useSearchParams();
  const causeId = searchParams.get("cause") || "";
  const selectedCause = CAUSE_PACKAGES.find((c) => c.id === causeId);
  const { lang } = useLanguage();

  const assurances = [
    {
      icon: ShieldCheck,
      textEn: "100% Direct Relief delivery to poor families & orphans.",
      textFr: "Distribution 100% directe aux familles démunies et orphelins.",
    },
    {
      icon: BadgeCheck,
      textEn: "Official receipts sent directly via WhatsApp or Email.",
      textFr: "Reçus officiels envoyés directement via WhatsApp ou Email.",
    },
    {
      icon: PhoneCall,
      textEn: "Direct contact line with Mr. Haji Abdul Safdar & Hafiz Fayyaz Ahmed.",
      textFr: "Ligne directe avec M. Haji Abdul Safdar & Hafiz Fayyaz Ahmed.",
    },
  ];

  return (
    <div className="section section-y space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Heart className="size-3.5 text-amber-600" />
          {lang === "fr" ? "Aumône, Zakat, Fitrana & Dons" : "Sadqah, Zakat, Fitrana & Charity"}
        </span>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-emerald-950 dark:text-emerald-100">
          {lang === "fr" ? "Coordonnées Bancaires Officieuses & Virement" : "Official Bank Details & Transfer Guide"}
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {selectedCause
            ? lang === "fr"
              ? `Projet sélectionné : « ${selectedCause.titleFr} » (€${selectedCause.priceEuro}). Copiez les coordonnées bancaires ci-dessous pour faire le virement.`
              : `You selected: “${selectedCause.titleEn}” (€${selectedCause.priceEuro}). Please copy the bank IBAN below to transfer.`
            : lang === "fr"
            ? "Sélectionnez l'un de nos comptes bancaires officiels en France, au Pakistan ou aux USA ci-dessous pour faire votre don."
            : "Select any of our official bank accounts in France, Pakistan, or the USA below to transfer your donation directly."}
        </p>
      </div>

      {/* Main Bank Hub */}
      <BankAccountsHub />

      {/* Cause Price Packages Quick Reference */}
      <div className="rounded-2xl border-2 border-emerald-800/10 bg-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            {lang === "fr" ? "Guide Tarifaire des Projets" : "Appeal Packages Quick Reference"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "fr"
              ? "Montants indicatifs pour parrainer un projet spécifique :"
              : "Amounts to reference when sending transfers for specific causes:"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {CAUSE_PACKAGES.map((pkg) => {
            const title = lang === "fr" ? pkg.titleFr : pkg.titleEn;
            const category = lang === "fr" ? pkg.categoryFr : pkg.categoryEn;

            return (
              <div key={pkg.id} className="rounded-xl border bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">{title}</span>
                  <span className="text-amber-600 font-mono text-sm">€{pkg.priceEuro}</span>
                </div>
                <p className="text-xs text-muted-foreground">{category}</p>
                <p className="text-[11px] text-muted-foreground font-mono">Approx Rs. {pkg.pricePkr.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assurances & Support */}
      <div className="grid gap-6 md:grid-cols-3">
        {assurances.map(({ icon: Icon, textEn, textFr }) => (
          <div key={textEn} className="flex items-center gap-3 rounded-xl border bg-accent/40 p-4 text-xs font-semibold text-foreground">
            <Icon className="size-5 shrink-0 text-emerald-700" />
            <span>{lang === "fr" ? textFr : textEn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


