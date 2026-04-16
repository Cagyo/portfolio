"use client";

import { XMarkIcon } from "../../../../assets/icons/XMarkIcon";
import type { FilterGroupConfig } from "../../../_data/projects-filters";

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
          className="active-chip"
        >
          <span className="text-white/40 text-xs">{groupLabel}:</span>
          {value}
          <XMarkIcon className="w-3 h-3 flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
