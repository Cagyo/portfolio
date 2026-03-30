"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "./skills-data";
import styles from "./SkillFilterTabs.module.css";

type SkillFilterTabsProps = {
  active: string
  counts: Record<string, number>
  onSelect: (cat: string) => void
}

export function SkillFilterTabs({ active, counts, onSelect }: SkillFilterTabsProps) {
  const t = useTranslations("skills");

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterAriaLabel")}>
      {CATEGORIES.map((cat) => {
        const key = cat.toLowerCase();
        const label = t(`categories.${key}`);
        const isActive = active === key;
        return (
          <button
            key={cat}
            onClick={() => onSelect(key)}
            className={`${styles.skillFilterBtn} px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${isActive ? styles.active : ""}`}
          >
            {label}
            {key === "all" && (
              <span className="skill-count ml-1 opacity-60">{counts.all ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
