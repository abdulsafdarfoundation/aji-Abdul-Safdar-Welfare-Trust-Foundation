import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function Logo({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const logoDimensions = size === "lg" ? 56 : size === "sm" ? 36 : 44;

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative shrink-0 overflow-hidden rounded-full border border-amber-500/30 bg-emerald-950/10 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/logo/WhatsApp Image 2026-08-17 at 6.36.46 PM.jpeg"
          alt="Haji Abdul Safdar Foundation Logo"
          width={logoDimensions}
          height={logoDimensions}
          className="h-auto w-auto object-contain rounded-full"
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

