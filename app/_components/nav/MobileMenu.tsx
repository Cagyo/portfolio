"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { HamburgerIcon } from "@/assets/icons/HamburgerIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";
import { Button } from "@/app/_components/button/Button";
import { useActiveSection } from "./use-active-section";
import styles from "./MobileMenu.module.css";

type NavLink = { label: string; href: string }

type MobileMenuProps = {
  links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const sectionIds = useMemo(() => links.map((link) => link.href.replace('#', '')), [links]);
  const activeId = useActiveSection(sectionIds);

  // SSR-safe portal mount — one-time flag; eslint-disable is intentional, not a pattern to copy
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Restore focus to hamburger on close (only on open→closed transitions, not on initial mount)
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        href="#contact"
        onClick={() => setOpen(false)}
        className="px-4 py-1.5 rounded-xl text-sm text-center cursor-pointer"
      >
        {t("cta")}
      </Button>

      <button
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        className="text-white/70 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        aria-label={t("mobileMenuOpenAriaLabel")}
        aria-expanded={open}
      >
        {open ? <XMarkIcon className="w-6 h-6" /> : <HamburgerIcon className="w-6 h-6" />}
      </button>

      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Fullscreen slide-down panel */}
          <div
            role="dialog"
            aria-modal={open}
            aria-label={t("mobileMenuAriaLabel")}
            aria-hidden={!open}
            inert={!open}
            className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
          >
            <nav aria-label={t("mobileMenuAriaLabel")} className={styles.menuNav}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`${styles.menuLink} ${link.href === `#${activeId}` ? styles.menuLinkActive : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
