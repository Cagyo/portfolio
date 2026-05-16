'use client'

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";
import styles from "./ExperienceList.module.css";

type ExperienceListProps = {
  initialSlice: React.ReactNode
  extraSlice?: React.ReactNode
  hiddenCount: number
}

export function ExperienceList({ initialSlice, extraSlice, hiddenCount }: ExperienceListProps) {
  const t = useTranslations("about");
  const [expanded, setExpanded] = useState(false);
  const panelId = "experience-extra-panel";

  return (
    <div className={styles.list}>
      {initialSlice}
      {hiddenCount > 0 && extraSlice && (
        <div
          id={panelId}
          className={styles.expandGrid}
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className={styles.expandInner}>
            {extraSlice}
          </div>
        </div>
      )}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={styles.toggle}
        >
          <span className={styles.toggleRule} aria-hidden="true" />
          <span className={styles.toggleText}>
            {expanded ? t("showLess") : t("showNMore", { count: hiddenCount })}
          </span>
          <ChevronDownIcon
            className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ""}`}
          />
          <span className={styles.toggleRule} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
