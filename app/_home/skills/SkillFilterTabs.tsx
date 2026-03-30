"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "./skills-data";
import styles from "./SkillFilterTabs.module.css";

type SkillFilterTabsProps = {
  active: number
  counts: Record<number, number>
  onSelect: (cat: number) => void
}

export function SkillFilterTabs({ active, counts, onSelect }: SkillFilterTabsProps) {
  const t = useTranslations("skills");

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterAriaLabel")}>
      {CATEGORIES.map((cat) => {
        const label = t(`categories.${cat.label.toLowerCase()}`);
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`${styles.skillFilterBtn} px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${isActive ? styles.active : ""}`}
          >
            {label}
            {cat.id === 0 && (
              <span className="skill-count ml-1 opacity-60">{counts[0] ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
