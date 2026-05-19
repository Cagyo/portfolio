"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/app/_data/skills-data";

type SkillFilterTabsProps = {
  active: number
  counts: Record<number, number>
  onSelect: (categoryId: number) => void
}

export function SkillFilterTabs({ active, counts, onSelect }: SkillFilterTabsProps) {
  const t = useTranslations("skills");

  return (
    <div className="flex flex-wrap gap-1.5 justify-start md:justify-end" role="group" aria-label={t("filterAriaLabel")}>
      {CATEGORIES.map((category) => {
        const label = t(`categories.${category.label.toLowerCase()}`);
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            aria-pressed={isActive}
            className="inline-flex items-center gap-1 min-h-[30px] px-[10px] py-[5px] rounded-[8px] text-[0.72rem] font-semibold cursor-pointer whitespace-nowrap transition-[background-color,border-color,color] duration-200 ease bg-[var(--filter-btn-bg)] border border-[var(--filter-btn-border)] text-[color:var(--filter-btn-color)] hover:bg-[color-mix(in_srgb,var(--amber)_8%,transparent)] hover:border-[color-mix(in_srgb,var(--amber)_25%,transparent)] hover:text-[color:var(--tag-color)] aria-pressed:bg-[color-mix(in_srgb,var(--amber)_12%,transparent)] aria-pressed:border-[color-mix(in_srgb,var(--amber)_40%,transparent)] aria-pressed:text-amber-foreground focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2"
          >
            {label}
            {category.id === 0 && (
              <span className="opacity-[0.58]">{counts[0] ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
