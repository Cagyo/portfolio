"use client";

import { useTranslations } from "next-intl";
import type { FilterGroupConfig } from "./projects-data";
import { FilterGroup } from "./FilterGroup";
import styles from "./FilterSidebar.module.css";

type FilterSidebarProps = {
  groups: FilterGroupConfig[]
  activeFilters: Record<string, Set<string>>
  onToggle: (groupKey: string, value: string) => void
  onClear: () => void
  totalActive: number
}

export function FilterSidebar({ groups, activeFilters, onToggle, onClear, totalActive }: FilterSidebarProps) {
  const t = useTranslations("projectsPage");

  return (
    <aside className={`${styles.sidebar} hidden lg:block w-60 flex-shrink-0`} aria-label={t("filters")}>
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
        <button
          type="button"
          onClick={onClear}
          className="w-full mt-4 text-center text-amber-500 text-xs hover:text-amber-400 cursor-pointer py-2 rounded-xl hover:bg-amber-500/5 transition-colors"
        >
          {t("clearAllFilters")}
        </button>
      )}
    </aside>
  );
}
