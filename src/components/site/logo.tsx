"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const LOGO_EN = "/logo/WhatsApp Image 2026-08-17 at 6.36.46 PM.jpeg";
const LOGO_FR = "/logo/logo-fr.jpg";

export function Logo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { lang } = useLanguage();
  const logoDimensions = size === "lg" ? 56 : size === "sm" ? 36 : 44;
  const logoSrc = lang === "fr" ? LOGO_FR : LOGO_EN;
  const logoAlt =
    lang === "fr"
      ? "حاجی عبدالصفدر ویلفیئر ٹرسٹ اینڈ فاؤنڈیشن فرانس"
      : "Haji Abdul Safdar Foundation Logo";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoDimensions}
          height={logoDimensions}
          className="h-auto w-auto object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-heading font-bold text-emerald-900 dark:text-emerald-100 text-base sm:text-lg tracking-tight">
          Haji Abdul Safdar
        </span>
        <span className="text-[11px] font-medium tracking-wide text-amber-700 dark:text-amber-400 uppercase">
          Welfare Trust & Foundation (France)
        </span>
      </div>
    </Link>
  );
}

