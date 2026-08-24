"use client";

import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 p-0.5 text-xs font-semibold shadow-xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer",
          lang === "en"
            ? "bg-emerald-800 text-white shadow-sm"
            : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60",
        )}
      >
        <span>🇬🇧</span>
        <span className="hidden sm:inline">English</span>
        <span className="sm:hidden">EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer",
          lang === "fr"
            ? "bg-emerald-800 text-white shadow-sm"
            : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60",
        )}
      >
        <span>🇫🇷</span>
        <span className="hidden sm:inline">Français</span>
        <span className="sm:hidden">FR</span>
      </button>
    </div>
  );
}
