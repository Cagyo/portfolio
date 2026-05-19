"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/app/_config/site-config";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import { Button } from "@/app/_components/button/Button";

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
    <nav className={`fixed left-4 right-4 z-50 transition-[top] duration-300 ${scrolled ? "top-2" : "top-4"}`}>
      <div className="w-full max-w-[72rem] mx-auto flex items-center justify-between gap-[0.875rem] lg:gap-4 pt-3 pb-3 pr-[0.875rem] pl-4 lg:py-[0.8125rem] lg:pr-4 lg:pl-[1.125rem] border border-[color-mix(in_srgb,var(--text-primary)_9%,transparent)] rounded-[1.125rem] bg-[color-mix(in_srgb,var(--bg-secondary)_82%,transparent)] shadow-[0_16px_48px_color-mix(in_srgb,var(--bg)_62%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.08]">
        <NavLogo />

        <div className="hidden lg:flex items-center gap-[0.95rem] min-[1180px]:gap-5">
          <NavLinks links={links} />
        </div>

        <div className="hidden lg:flex items-center gap-[0.625rem]">
          <ThemeToggle initialIsDark={initialIsDark} />
          <Button href={ctaHref} className="min-h-9 px-4 rounded-[0.75rem] text-[0.8125rem] cursor-pointer whitespace-nowrap">
            {cta}
          </Button>
        </div>

        <div className="flex items-center gap-2 min-w-0 lg:hidden">
          <ThemeToggle initialIsDark={initialIsDark} />
          <MobileMenu links={links} cta={{ href: ctaHref, label: cta }} />
        </div>
      </div>
    </nav>
  );
}
