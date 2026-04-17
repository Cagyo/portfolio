"use client";

import { useState } from "react";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";
import styles from "./FilterSidebar.module.css";

type FilterGroupProps = {
  label: string
  options: string[]
  active: Set<string>
  onToggle: (value: string) => void
}

export function FilterGroup({ label, options, active, onToggle }: FilterGroupProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-5">
      <button
        type="button"
        className={styles.groupHeader}
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">{label}</span>
        <ChevronDownIcon
          className={`${styles.groupChevron} w-3.5 h-3.5 ${collapsed ? styles.groupChevronCollapsed : ""}`}
        />
      </button>

      <div
        className={styles.groupContent}
        style={{ maxHeight: collapsed ? 0 : undefined }}
      >
        <div className="flex flex-wrap gap-1.5 pt-2.5">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`${styles.pill} ${active.has(opt) ? styles.pillActive : ""}`}
            >
              <CheckIcon className={`${styles.pillCheck} w-3 h-3 flex-shrink-0`} strokeWidth={3} />
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
