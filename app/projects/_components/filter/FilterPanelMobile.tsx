"use client";

import { useTranslations } from "next-intl";
import { XMarkIcon } from "../../../../assets/icons/XMarkIcon";
import type { FilterGroupConfig } from "../projects-data";
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

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`${styles.panel} ${open ? styles.panelOpen : ""} p-6 pt-8`} role="dialog" aria-label={t("filters")}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-white text-lg">{t("filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white cursor-pointer transition-colors"
            aria-label="Close filters"
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
          />
        ))}

        {totalActive > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => { onClear(); onClose(); }}
              className="w-full text-center text-amber-500 text-sm hover:text-amber-400 cursor-pointer py-2"
            >
              {t("clearAllFilters")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
