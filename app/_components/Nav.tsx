"use client";

import { useEffect, useState } from "react";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

const HOME_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#recommendations" },
  { label: "Services", href: "#engagement" },
  { label: "Fit", href: "#fit" },
  { label: "Contact", href: "#contact" },
];

type NavProps = {
  links?: { label: string; href: string }[]
  ctaHref?: string
  ctaLabel?: string
}

export function Nav({ links = HOME_LINKS, ctaHref = "#contact", ctaLabel = "Hire Me" }: NavProps) {
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
          <a href={ctaHref} className="btn-amber px-5 py-2 rounded-xl text-sm cursor-pointer">
            <span>{ctaLabel}</span>
          </a>
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
