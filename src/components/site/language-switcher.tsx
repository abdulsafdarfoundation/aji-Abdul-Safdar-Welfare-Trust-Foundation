"use client";

import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center rounded-full border border-amber-500/30 bg-emerald-950/20 p-0.5 text-xs font-semibold shadow-xs backdrop-blur-xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer",
          lang === "en"
            ? "bg-amber-500 text-white shadow-xs"
            : "text-emerald-200 hover:text-white hover:bg-emerald-900/40",
        )}
      >
        <span>🇬🇧</span>
        <span>English</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer",
          lang === "fr"
            ? "bg-amber-500 text-white shadow-xs"
            : "text-emerald-200 hover:text-white hover:bg-emerald-900/40",
        )}
      >
        <span>🇫🇷</span>
        <span>Français</span>
      </button>
    </div>
  );
}
