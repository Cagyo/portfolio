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
    <div className="space-y-4">
      {initialSlice}
      {hiddenCount > 0 && extraSlice && (
        <div
          id={panelId}
          className={styles.expandGrid}
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className={`${styles.expandInner} space-y-4 pt-4`}>
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
          className="w-full flex items-center gap-3 text-white/25 hover:text-white/50 transition-colors duration-200 cursor-pointer group py-1"
        >
          <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
          <span className="text-xs tracking-wide">
            {expanded ? t("showLess") : t("showNMore", { count: hiddenCount })}
          </span>
          <ChevronDownIcon
            className={`w-3 h-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
          <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
        </button>
      )}
    </div>
  );
}
