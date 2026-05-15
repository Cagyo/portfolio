"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftShortIcon } from "@/assets/icons/ArrowLeftShortIcon";
import { IconMarkFace } from "@/app/_og/icon-mark-face";
import styles from "./NavLogo.module.css";

type NavLogoProps = {
  href?: string
  showBackArrow?: boolean
  ariaLabel?: string
}

export function NavLogo({ href = "#hero", showBackArrow = false, ariaLabel }: NavLogoProps) {
  const t = useTranslations("common");

  return (
    <Link href={href} className={styles.logo} aria-label={ariaLabel}>
      {showBackArrow && (
        <ArrowLeftShortIcon className={styles.backIcon} />
      )}
      <IconMarkFace size={32} />
      <span className={styles.name}>
        {t("author")}
      </span>
    </Link>
  );
}
