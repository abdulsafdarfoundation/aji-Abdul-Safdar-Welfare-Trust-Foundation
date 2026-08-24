"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, PhoneCall, Heart } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { useLanguage } from "@/context/language-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const NAV = [
  { href: "/", labelEn: "Home", labelFr: "Accueil" },
  { href: "/#causes", labelEn: "Causes & Appeals", labelFr: "Nos Projets" },
  { href: "/#gallery", labelEn: "Work Done", labelFr: "Nos Actions" },
  { href: "/donate", labelEn: "Bank Accounts & Donate", labelFr: "Faire un Don" },
  { href: "/about", labelEn: "About Foundation", labelFr: "À Propos" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="section flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-medium tracking-wide">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold">
              {lang === "fr" ? `Depuis ${SITE.since}` : `Since ${SITE.since}`}
            </span>
            <span className="hidden sm:inline text-amber-200">
              {SITE.tagline[lang]}
            </span>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <LanguageSwitcher />
            <span className="text-emerald-700">|</span>
            <a
              href={SITE.contacts.france.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <PhoneCall className="size-3 text-amber-400" />
              <span>FR: {SITE.contacts.france.displayPhone}</span>
            </a>
            <span className="text-emerald-700">|</span>
            <a
              href={SITE.contacts.pakistan.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <PhoneCall className="size-3 text-amber-400" />
              <span>PK: {SITE.contacts.pakistan.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="section flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={lang === "fr" ? item.labelFr : item.labelEn}
              active={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <Link href="/donate" className="flex items-center gap-2">
              <Heart className="size-4 fill-white/20 text-white animate-pulse" />
              <span>{lang === "fr" ? "Faire un Don" : "Donate Now"}</span>
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu">
                <Menu className="size-6 text-emerald-900 dark:text-emerald-100" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 px-2">
                <LanguageSwitcher className="w-full justify-center" />
              </div>

              <nav aria-label="Mobile Navigation" className="mt-6 flex flex-col gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100",
                      pathname === item.href && "bg-emerald-100/60 dark:bg-emerald-900/40 font-semibold",
                    )}
                  >
                    {lang === "fr" ? item.labelFr : item.labelEn}
                  </Link>
                ))}
                
                <div className="mt-6 pt-4 border-t space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    {lang === "fr" ? "Contact Direct" : "Direct Contact"}
                  </p>
                  <a
                    href={SITE.contacts.france.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent text-xs"
                  >
                    <div>
                      <p className="font-semibold">{SITE.contacts.france.name} (France)</p>
                      <p className="text-muted-foreground">{SITE.contacts.france.displayPhone}</p>
                    </div>
                    <span className="text-emerald-600 font-bold">WhatsApp</span>
                  </a>
                  <a
                    href={SITE.contacts.pakistan.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent text-xs"
                  >
                    <div>
                      <p className="font-semibold">{SITE.contacts.pakistan.name} (PK)</p>
                      <p className="text-muted-foreground">{SITE.contacts.pakistan.displayPhone}</p>
                    </div>
                    <span className="text-emerald-600 font-bold">WhatsApp</span>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
        active ? "text-emerald-800 dark:text-emerald-200 font-semibold bg-emerald-100/50 dark:bg-emerald-900/30" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}


