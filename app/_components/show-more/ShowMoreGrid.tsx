'use client'

import React from "react";
import { ChevronDownIcon } from "../../../assets/icons/ChevronDownIcon";
import { useShowMore } from "../../_components/show-more/use-show-more";

type ShowMoreGridProps = {
  children: React.ReactNode
  total: number
  initialVisible?: number
  className?: string
}

export function ShowMoreGrid({ children, total, initialVisible = 3, className }: ShowMoreGridProps) {
  const { expanded, toggle, hiddenCount } = useShowMore(total, initialVisible);
  const items = React.Children.toArray(children);
  const visible = expanded ? items : items.slice(0, initialVisible);

  return (
    <div>
      <div className={className}>
        {visible}
      </div>
      {hiddenCount > 0 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={toggle}
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
