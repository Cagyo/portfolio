"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/app/_config/site-config";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import { Button } from "@/app/_components/button/Button";
import styles from "./Nav.module.css";

type NavProps = {
  initialIsDark: boolean
  links?: { label: string; href: string }[]
  ctaHref?: string
  ctaLabel?: string
}

export function Nav({ initialIsDark, links: linksProp, ctaHref = "#contact", ctaLabel }: NavProps) {
  const t = useTranslations("nav");

  const defaultLinks = useMemo(
    () =>
      siteConfig.sections
        .filter((section): section is typeof section & { navKey: string } =>
          section.enabled && 'navKey' in section
        )
        .map((section) => ({
          label: t(`links.${section.navKey}`),
          href: `#${section.id}`,
        })),
    [t],
  );

  const links = linksProp ?? defaultLinks;
  const cta = ctaLabel ?? t("cta");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`${styles.root} ${scrolled ? styles.rootScrolled : ""}`}
    >
      <div className={styles.bar}>
        <NavLogo />

        <div className={styles.desktopLinks}>
          <NavLinks links={links} />
        </div>

        <div className={styles.desktopActions}>
          <ThemeToggle initialIsDark={initialIsDark} />
          <Button href={ctaHref} className={styles.desktopCta}>
            {cta}
          </Button>
        </div>

        <div className={styles.mobileActions}>
          <ThemeToggle initialIsDark={initialIsDark} />
          <MobileMenu links={links} cta={{ href: ctaHref, label: cta }} />
        </div>
      </div>
    </nav>
  );
}
