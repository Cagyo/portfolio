// TODO(navshell): Nav and SubpageNav share scroll listener, glass pill, logo slot, mobile
// hamburger wiring. Factor into a shared <NavShell> when a third consumer appears.
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/app/_components/button/Button";

type NavSection = { label: string; href: string }

type SubpageNavProps = {
  backHref?: string
  backLabel?: string
  sections?: NavSection[]
  cta?: { href: string; label: string }
  /** Escape hatch for subpage-specific controls (e.g. filter button + count chip). Think twice. */
  rightExtras?: React.ReactNode
  maxWidth?: "max-w-6xl" | "max-w-7xl"
}

export function SubpageNav({
  backHref = "/",
  backLabel,
  sections = [],
  cta,
  rightExtras,
  maxWidth = "max-w-6xl",
}: SubpageNavProps) {
  const t = useTranslations("subpageNav");
  const resolvedBackLabel = backLabel ?? t("backHome");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const hasSections = sections.length > 0;
  const hasCta = !!cta;
  const hasMobileMenu = hasSections || hasCta;

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-30 duration-300 transition-[top] ${scrolled ? "top-2" : ""}`}
    >
      <div className={`${maxWidth} mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between`}>
        <NavLogo href={backHref} showBackArrow ariaLabel={resolvedBackLabel} />

        {/* Desktop section links */}
        {hasSections && (
          <div className="hidden md:flex items-center gap-6">
            <NavLinks links={sections} />
          </div>
        )}

        {/* Desktop CTA + extras */}
        <div className="hidden md:flex items-center gap-3">
          {rightExtras}
          {hasCta && (
            <Button href={cta.href} className="px-5 py-2 rounded-xl text-sm cursor-pointer">
              {cta.label}
            </Button>
          )}
        </div>

        {/* Mobile: extras + optional hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {rightExtras}
          {hasMobileMenu && (
            <MobileMenu
              links={sections}
              cta={cta}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
