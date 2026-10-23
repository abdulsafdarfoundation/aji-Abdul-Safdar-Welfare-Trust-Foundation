"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, ShieldCheck, Heart, QrCode, Smartphone, Download, X, Maximize2 } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function BankAccountsHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrFullscreen, setQrFullscreen] = useState(false);
  const { lang } = useLanguage();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveQr = useCallback(async () => {
    try {
      const response = await fetch(SITE.bankDetails.paypal.qrImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "PayPal-QR-HASF-Foundation.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab for manual save
      window.open(SITE.bankDetails.paypal.qrImage, "_blank");
    }
  }, []);

  return (
    <div className="space-y-8" id="bank-accounts">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="size-4 text-emerald-600" />
          {lang === "fr" ? "Coordonnées Bancaires Vérifiées" : "Direct Bank, PayPal & Transfer Details"}
        </span>
        <h2 className="text-3xl font-heading font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl">
          {lang === "fr"
            ? "Faites un Don par PayPal ou Virement Bancaire"
            : "Donate via PayPal or Bank Transfer"}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {lang === "fr"
            ? "Scannez notre QR PayPal pour un paiement instantané, ou transférez directement sur nos comptes bancaires vérifiés en France, au Pakistan ou aux États-Unis."
            : "Scan our PayPal QR for instant payment, or transfer directly to our verified bank accounts in France, Pakistan, or the United States."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* PayPal QR Code — International */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 md:col-span-3">
          <div className="flex items-center justify-between gap-3 border-b border-blue-200 dark:border-blue-800/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <QrCode className="size-4.5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {lang === "fr" ? "PayPal — International" : "PayPal — Worldwide"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lang === "fr" ? "Scan et payez instantanément" : "Scan & pay instantly from anywhere"}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 uppercase">
              {lang === "fr" ? "Toutes devises" : "All Currencies"}
            </span>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] items-center">
            {/* QR Code Image — Full width on mobile */}
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setQrFullscreen(true)}
                className="group relative w-full max-w-xs sm:w-auto sm:max-w-none mx-auto overflow-hidden rounded-xl border-2 border-blue-200 dark:border-blue-800/40 bg-white shadow-sm hover:shadow-lg transition-all active:scale-[0.98] cursor-zoom-in"
                aria-label={lang === "fr" ? "Voir le QR en plein écran" : "View QR fullscreen"}
              >
                <div className="relative aspect-square w-full sm:size-52">
                  <Image
                    src={SITE.bankDetails.paypal.qrImage}
                    alt={`PayPal QR code for ${SITE.bankDetails.paypal.accountName}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 80vw, 208px"
                    priority
                  />
                </div>
                {/* Tap-to-expand hint overlay */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity sm:hidden pointer-events-none">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                    <Maximize2 className="size-3.5" />
                    {lang === "fr" ? "Appuyer pour agrandir" : "Tap to enlarge"}
                  </span>
                </div>
                {/* Desktop hover hint */}
                <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                    <Maximize2 className="size-3.5" />
                    {lang === "fr" ? "Cliquer pour agrandir" : "Click to enlarge"}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium sm:flex hidden">
                <Smartphone className="size-3.5" />
                <span>{lang === "fr" ? "Scannez avec votre téléphone" : "Scan with your phone camera"}</span>
              </div>
            </div>

            {/* PayPal Details */}
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{lang === "fr" ? "Destinataire PayPal :" : "PayPal Recipient:"}</p>
                <p className="font-mono font-bold text-foreground text-base">
                  {SITE.bankDetails.paypal.accountName}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/30 p-4 space-y-2">
                <p className="font-semibold text-foreground text-xs">
                  {lang === "fr" ? "Comment ça marche :" : "How it works:"}
                </p>
                <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>{lang === "fr" ? "Ouvrez l'appareil photo de votre téléphone" : "Open your phone camera or PayPal app"}</li>
                  <li>{lang === "fr" ? "Scannez le QR code ci-contre" : "Scan the QR code"}</li>
                  <li>{lang === "fr" ? "Entrez le montant et confirmez le paiement" : "Enter amount & confirm payment"}</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2 sm:grid-cols-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveQr}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-lg border-2 border-blue-600 bg-white dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98] text-blue-700 dark:text-blue-300 font-semibold text-xs py-2.5 px-4 transition-all"
                >
                  <Download className="size-4" />
                  <span>{lang === "fr" ? "Enregistrer le QR" : "Save QR to Phone"}</span>
                </button>
                <a
                  href={SITE.contacts.france.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98] text-white font-medium text-xs py-2.5 px-4 transition-all"
                >
                  <ExternalLink className="size-3.5" />
                  <span>{lang === "fr" ? "Confirmer par WhatsApp" : "Confirm via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen QR Overlay */}
        {qrFullscreen && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-4 animate-in fade-in zoom-in-95 duration-200 md:col-span-3"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "fr" ? "QR PayPal en plein écran" : "PayPal QR fullscreen"}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setQrFullscreen(false)}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
              aria-label={lang === "fr" ? "Fermer" : "Close"}
            >
              <X className="size-5 text-zinc-700 dark:text-zinc-300" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {lang === "fr" ? "PayPal — Scannez pour Payer" : "PayPal — Scan to Pay"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {SITE.bankDetails.paypal.accountName}
              </p>
            </div>

            {/* Full QR Image */}
            <div className="relative w-full max-w-sm aspect-square bg-white rounded-2xl border-2 border-blue-200 dark:border-blue-800/40 shadow-xl overflow-hidden">
              <Image
                src={SITE.bankDetails.paypal.qrImage}
                alt={`PayPal QR code for ${SITE.bankDetails.paypal.accountName}`}
                fill
                className="object-contain p-3"
                sizes="(max-width: 640px) 90vw, 384px"
                priority
              />
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-col gap-3 w-full max-w-sm">
              <button
                type="button"
                onClick={handleSaveQr}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 px-6 transition-all shadow-lg"
              >
                <Download className="size-5" />
                <span>{lang === "fr" ? "Enregistrer le QR dans le téléphone" : "Save QR Image to Phone"}</span>
              </button>
              <button
                type="button"
                onClick={() => setQrFullscreen(false)}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] text-foreground font-medium text-sm py-3 px-6 transition-all"
              >
                {lang === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
        )}

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
                Hafiz Fiaz Ahmed ({SITE.contacts.pakistan.displayPhone})
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

