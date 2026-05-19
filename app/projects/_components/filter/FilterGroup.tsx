"use client";

import { useId, useState } from "react";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";
import styles from "./FilterSidebar.module.css";

type FilterGroupProps = {
  label: string
  options: string[]
  active: Set<string>
  onToggle: (value: string) => void
  defaultCollapsed?: boolean
}

export function FilterGroup({ label, options, active, onToggle, defaultCollapsed = false }: FilterGroupProps) {
  const contentId = useId();
  const [userCollapsed, setUserCollapsed] = useState(defaultCollapsed);
  const collapsed = active.size > 0 ? false : userCollapsed;

  return (
    <div className="mb-5">
      <button
        type="button"
        className={styles.groupHeader}
        onClick={() => setUserCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">{label}</span>
        <ChevronDownIcon
          className={`${styles.groupChevron} w-3.5 h-3.5 ${collapsed ? styles.groupChevronCollapsed : ""}`}
        />
      </button>

      <div
        id={contentId}
        className={`${styles.groupContent} ${collapsed ? styles.groupContentCollapsed : ""}`}
        aria-hidden={collapsed}
      >
        <div className={styles.groupContentInner}>
          <div className="flex flex-wrap gap-1.5 pt-2.5">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onToggle(opt)}
                tabIndex={collapsed ? -1 : undefined}
                className={`${styles.pill} ${active.has(opt) ? styles.pillActive : ""}`}
              >
                <CheckIcon className={`${styles.pillCheck} w-3 h-3 flex-shrink-0`} strokeWidth={3} />
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
