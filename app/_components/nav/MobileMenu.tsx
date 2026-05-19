"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/app/_lib/cn";
import { HamburgerIcon } from "@/assets/icons/HamburgerIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";
import { Button } from "@/app/_components/button/Button";
import { useActiveSection } from "./use-active-section";

type NavLink = { label: string; href: string }

type MobileMenuProps = {
  links: NavLink[]
  cta?: { href: string; label: string }
}

export function MobileMenu({ links, cta }: MobileMenuProps) {
  const t = useTranslations("nav");
  const ctaHref = cta?.href ?? "#contact";
  const ctaLabel = cta?.label ?? t("cta");
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

  // Reset open state when navigating away (Activity preservation)
  useEffect(() => {
    return () => setOpen(false);
  }, []);

  return (
    <>
      <Button
        href={ctaHref}
        onClick={() => setOpen(false)}
        className="inline-flex items-center justify-center min-h-9 px-[0.875rem] rounded-[0.75rem] text-[0.8125rem] leading-none whitespace-nowrap"
      >
        {ctaLabel}
      </Button>

      {links.length > 0 && (
        <button
          ref={triggerRef}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center w-9 h-9 p-0 border border-transparent rounded-[0.75rem] bg-transparent text-foreground-soft cursor-pointer transition-[color,background-color,border-color] duration-200 hover:text-foreground hover:bg-amber/8 hover:border-[color-mix(in_srgb,var(--amber)_22%,transparent)] focus-visible:outline-2 focus-visible:outline focus-visible:outline-[color-mix(in_srgb,var(--amber)_70%,transparent)] focus-visible:outline-offset-[0.1875rem]"
          aria-label={t("mobileMenuOpenAriaLabel")}
          aria-expanded={open}
        >
          {open ? <XMarkIcon className="w-6 h-6" /> : <HamburgerIcon className="w-6 h-6" />}
        </button>
      )}

      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "mobile-overlay fixed inset-0 backdrop-blur-[4px] z-40 transition-opacity duration-[250ms] ease-[ease]",
              open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
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
            className={cn(
              "fixed inset-0 z-40 bg-background-elevated overflow-y-auto overflow-x-hidden flex flex-col items-center pt-[120px] pb-12 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              open ? "translate-y-0" : "-translate-y-full"
            )}
          >
            <nav aria-label={t("mobileMenuAriaLabel")} className="flex flex-col items-center gap-6 w-full">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-2xl font-medium text-foreground-soft transition-colors duration-200 px-4 py-2 cursor-pointer hover:text-foreground",
                    link.href === `#${activeId}` && "text-amber-foreground"
                  )}
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
