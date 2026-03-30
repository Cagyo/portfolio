"use client";

import type { FilterGroupConfig } from "../projects-data";
import styles from "./FilterSidebar.module.css";

type ActiveChipsProps = {
  activeFilters: Record<string, Set<string>>
  groups: FilterGroupConfig[]
  onRemove: (groupKey: string, value: string) => void
}

export function ActiveChips({ activeFilters, groups, onRemove }: ActiveChipsProps) {
  const chips: { groupKey: string; groupLabel: string; value: string }[] = [];

  for (const group of groups) {
    for (const val of activeFilters[group.key]) {
      chips.push({ groupKey: group.key, groupLabel: group.label, value: val });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ groupKey, groupLabel, value }) => (
        <button
          key={`${groupKey}:${value}`}
          type="button"
          onClick={() => onRemove(groupKey, value)}
          className={styles.activeChip}
        >
          <span className="text-white/40 text-xs">{groupLabel}:</span>
          {value}
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
    </div>
  );
}
