"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function BankAccountsHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { lang } = useLanguage();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8" id="bank-accounts">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="size-4 text-emerald-600" />
          {lang === "fr" ? "Coordonnées Bancaires Vérifiées" : "Direct Bank & Transfer Details"}
        </span>
        <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl">
          {lang === "fr"
            ? "Faites un Don Directement par Virement Bancaire"
            : "Donate Directly via Bank Transfer"}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {lang === "fr"
            ? "Transférez votre Zakat, Aumône (Sadqah), ou don général directement sur nos comptes bancaires vérifiés en France, au Pakistan ou aux États-Unis."
            : "Transfer your Sadqah, Zakat, Fitrana, or General Donations directly to our verified bank accounts in France, Pakistan, or the United States."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* France LCL Bank */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-800/20 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{SITE.bankDetails.france.flag}</span>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {SITE.bankDetails.france.country}
                </h3>
                <p className="text-xs text-muted-foreground">{SITE.bankDetails.france.bankName}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 uppercase">
              EUR €
            </span>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Titulaire du compte :" : "Account Title:"}</p>
              <p className="font-mono font-bold text-foreground text-sm">
                {SITE.bankDetails.france.accountTitle}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Numéro IBAN :" : "IBAN Number:"}</p>
              <div className="mt-1 flex items-center justify-between rounded-lg border bg-muted/50 p-2 font-mono text-[11px] font-semibold">
                <span className="truncate mr-2">{SITE.bankDetails.france.iban}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                  onClick={() => handleCopy(SITE.bankDetails.france.iban, "iban-fr")}
                >
                  {copiedId === "iban-fr" ? (
                    <Check className="size-3.5 text-emerald-600 font-bold" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                  <span className="sr-only">Copy IBAN</span>
                </Button>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Code BIC / SWIFT :" : "BIC / SWIFT Code:"}</p>
              <p className="font-mono font-semibold text-foreground">
                {SITE.bankDetails.france.bic}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <a
              href={SITE.contacts.france.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs py-2.5 px-4 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              <span>{lang === "fr" ? `Envoyer le Reçu par WhatsApp (${SITE.contacts.france.displayPhone})` : `Send Receipt via WhatsApp (${SITE.contacts.france.displayPhone})`}</span>
            </a>
          </div>
        </div>

        {/* Pakistan Meezan Bank */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-800/20 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{SITE.bankDetails.pakistan.flag}</span>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {SITE.bankDetails.pakistan.country}
                </h3>
                <p className="text-xs text-muted-foreground">{SITE.bankDetails.pakistan.bankName}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 uppercase">
              PKR ₨
            </span>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Titulaire du compte :" : "Account Title:"}</p>
              <p className="font-mono font-bold text-foreground text-sm">
                {SITE.bankDetails.pakistan.accountTitle}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "IBAN Meezan Bank :" : "Meezan Bank IBAN:"}</p>
              <div className="mt-1 flex items-center justify-between rounded-lg border bg-muted/50 p-2 font-mono text-[11px] font-semibold">
                <span className="truncate mr-2">{SITE.bankDetails.pakistan.iban}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                  onClick={() => handleCopy(SITE.bankDetails.pakistan.iban, "iban-pk")}
                >
                  {copiedId === "iban-pk" ? (
                    <Check className="size-3.5 text-emerald-600 font-bold" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                  <span className="sr-only">Copy IBAN</span>
                </Button>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Représentant au Pakistan :" : "Contact Representative:"}</p>
              <p className="font-semibold text-foreground">
                Hafiz Fayyaz Ahmed ({SITE.contacts.pakistan.displayPhone})
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <a
              href={SITE.contacts.pakistan.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs py-2.5 px-4 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              <span>{lang === "fr" ? "Envoyer le Reçu par WhatsApp (PK)" : "Send Receipt via WhatsApp (PK)"}</span>
            </a>
          </div>
        </div>

        {/* USA Zelle */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-800/20 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{SITE.bankDetails.usa.flag}</span>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {SITE.bankDetails.usa.country}
                </h3>
                <p className="text-xs text-muted-foreground">{SITE.bankDetails.usa.method}</p>
              </div>
            </div>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 uppercase">
              USD $ (Zelle)
            </span>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Nom du Destinataire Zelle :" : "Zelle Recipient Name:"}</p>
              <p className="font-mono font-bold text-foreground text-sm">
                {SITE.bankDetails.usa.accountTitle}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Téléphone / ID Zelle :" : "Zelle Phone / ID:"}</p>
              <div className="mt-1 flex items-center justify-between rounded-lg border bg-muted/50 p-2 font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                <span>{SITE.bankDetails.usa.zelleId}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-purple-100 dark:hover:bg-purple-900/60"
                  onClick={() => handleCopy(SITE.bankDetails.usa.zelleId, "zelle-us")}
                >
                  {copiedId === "zelle-us" ? (
                    <Check className="size-3.5 text-purple-600 font-bold" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                  <span className="sr-only">Copy Zelle ID</span>
                </Button>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">{lang === "fr" ? "Représentant aux USA :" : "USA Representative:"}</p>
              <p className="font-semibold text-foreground">
                Asad ({SITE.contacts.usa.displayPhone})
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <a
              href={`https://wa.me/15516890350`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs py-2.5 px-4 transition-colors"
            >
              <Heart className="size-3.5" />
              <span>{lang === "fr" ? "Contacter le Représentant USA" : "Contact USA Representative"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

