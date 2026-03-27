"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HamburgerIcon } from "../../assets/icons/HamburgerIcon";

type NavLink = { label: string; href: string }

type MobileMenuProps = {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-white/70 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        aria-label={t("mobileMenuAriaLabel")}
        aria-expanded={open}
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="md:hidden mt-2 glass rounded-2xl px-6 py-4 flex flex-col gap-4 max-w-6xl mx-auto">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white font-medium cursor-pointer py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-amber px-5 py-2 rounded-xl text-sm text-center cursor-pointer"
          >
            <span>{t("cta")}</span>
          </a>
        </div>
      )}
    </>
  );
}
