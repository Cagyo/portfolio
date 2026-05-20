"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";
import type { FilterGroupConfig } from "@/app/_data/projects-filters";
import { FilterGroup } from "./FilterGroup";
import styles from "./FilterPanelMobile.module.css";

type FilterPanelMobileProps = {
  open: boolean
  onClose: () => void
  groups: FilterGroupConfig[]
  activeFilters: Record<string, Set<string>>
  onToggle: (groupKey: string, value: string) => void
  onClear: () => void
  totalActive: number
}

export function FilterPanelMobile({
  open,
  onClose,
  groups,
  activeFilters,
  onToggle,
  onClear,
  totalActive,
}: FilterPanelMobileProps) {
  const t = useTranslations("projectsPage");
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    if (panel) {
      const firstFocusable = panel.querySelector<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      (firstFocusable ?? panel).focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [onClose, open]);

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-background/60 z-40 transition-opacity duration-300 ease-linear motion-reduce:transition-none ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`${styles.panel} fixed left-0 top-0 bottom-0 w-[min(320px,90vw)] z-50 overflow-y-auto bg-card border-r border-border transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none focus:outline-none ${open ? "translate-x-0" : "-translate-x-full"} p-6 pt-8`}
        role="dialog"
        aria-modal="true"
        aria-label={t("filters")}
        inert={!open}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-foreground text-lg">{t("filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-11 min-h-11 items-center justify-center text-faint-foreground cursor-pointer transition-[color,background] duration-200 ease-linear rounded-[10px] hover:text-foreground hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 motion-reduce:transition-none"
            aria-label={t("closeFilters")}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {groups.map((group) => (
          <FilterGroup
            key={group.key}
            label={group.label}
            options={group.options}
            active={activeFilters[group.key]}
            onToggle={(value) => onToggle(group.key, value)}
            defaultCollapsed={group.defaultCollapsed}
          />
        ))}

        {totalActive > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => { onClear(); onClose(); }}
              className="w-full text-center text-amber-foreground text-sm hover:text-amber-foreground/80 cursor-pointer py-2"
            >
              {t("clearAllFilters")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
