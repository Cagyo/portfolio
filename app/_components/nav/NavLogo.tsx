"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";

type NavLogoProps = {
  href?: string
  showBackArrow?: boolean
  ariaLabel?: string
}

export function NavLogo({ href = "#hero", showBackArrow = false, ariaLabel }: NavLogoProps) {
  const t = useTranslations("common");

  return (
    <Link href={href} className="flex items-center gap-3 cursor-pointer group" aria-label={ariaLabel}>
      {showBackArrow && (
        <ArrowLeftIcon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
      )}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-heading font-black text-xs flex-shrink-0 overflow-hidden">
        <span>OB</span>
      </div>
      <span className="font-heading font-bold text-sm text-white/80 group-hover:text-white transition-colors hidden sm:block">
        {t("author")}
      </span>
    </Link>
  );
}
