"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftShortIcon } from "@/assets/icons/ArrowLeftShortIcon";
import { IconMarkFace } from "@/app/_og/icon-mark-face";

type NavLogoProps = {
  href?: string
  showBackArrow?: boolean
  ariaLabel?: string
}

export function NavLogo({ href = "#hero", showBackArrow = false, ariaLabel }: NavLogoProps) {
  const t = useTranslations("common");

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 text-foreground-soft no-underline cursor-pointer focus-visible:outline-2 focus-visible:outline focus-visible:outline-[color-mix(in_srgb,var(--amber)_70%,transparent)] focus-visible:outline-offset-[0.375rem] focus-visible:rounded-[0.625rem]"
      aria-label={ariaLabel}
    >
      {showBackArrow && (
        <ArrowLeftShortIcon className="w-4 h-4 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
      )}
      <IconMarkFace size={32} />
      <span className="hidden sm:inline text-foreground-soft font-heading text-sm font-bold leading-none transition-colors duration-200 whitespace-nowrap group-hover:text-foreground">
        {t("author")}
      </span>
    </Link>
  );
}
