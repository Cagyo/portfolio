'use client'

import { useState } from "react";
import { ChevronDownIcon } from "../../../assets/icons/ChevronDownIcon";

type ShowMoreGridProps = {
  visibleSlice: React.ReactNode
  hiddenSlice?: React.ReactNode
  hiddenCount: number
  className?: string
}

export function ShowMoreGrid({ visibleSlice, hiddenSlice, hiddenCount, className }: ShowMoreGridProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className={className}>
        {visibleSlice}
        {expanded && hiddenSlice}
      </div>
      {hiddenCount > 0 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors duration-200 cursor-pointer group"
          >
            <span>{expanded ? "Show less" : `Show ${hiddenCount} more`}</span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
