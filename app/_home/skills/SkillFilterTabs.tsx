"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/app/_data/skills-data";
import styles from "./SkillFilterTabs.module.css";

type SkillFilterTabsProps = {
  active: number
  counts: Record<number, number>
  onSelect: (categoryId: number) => void
}

export function SkillFilterTabs({ active, counts, onSelect }: SkillFilterTabsProps) {
  const t = useTranslations("skills");

  return (
    <div className={styles.filterGroup} role="group" aria-label={t("filterAriaLabel")}>
      {CATEGORIES.map((category) => {
        const label = t(`categories.${category.label.toLowerCase()}`);
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`${styles.skillFilterBtn} ${isActive ? styles.active : ""}`}
          >
            {label}
            {category.id === 0 && (
              <span className={styles.skillCount}>{counts[0] ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
