"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "../button/Button";

type NavProps = {
  links?: { label: string; href: string }[]
  ctaHref?: string
  ctaLabel?: string
}

export function Nav({ links: linksProp, ctaHref = "#contact", ctaLabel }: NavProps) {
  const t = useTranslations("nav");

  const defaultLinks = [
    { label: t("links.about"), href: "#about" },
    { label: t("links.skills"), href: "#skills" },
    { label: t("links.projects"), href: "#projects" },
    { label: t("links.reviews"), href: "#recommendations" },
    { label: t("links.services"), href: "#engagement" },
    { label: t("links.fit"), href: "#fit" },
    { label: t("links.contact"), href: "#contact" },
  ];

  const links = linksProp ?? defaultLinks;
  const cta = ctaLabel ?? t("cta");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 duration-300 transition-[top] ${scrolled ? "top-2" : ""}`}
    >
      <div className="max-w-6xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between">
        <NavLogo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks links={links} />
        </div>

        {/* Desktop CTA + theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button href={ctaHref} className="px-5 py-2 rounded-xl text-sm cursor-pointer">
            {cta}
          </Button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </div>
    </nav>
  );
}
