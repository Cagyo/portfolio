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
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ""} p-6 pt-8`}
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
            className={styles.closeButton}
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
