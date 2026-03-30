'use client'

import React, { useState } from "react";
import { ChevronDownIcon } from "../../../assets/icons/ChevronDownIcon";

const INITIAL_VISIBLE = 2

type ExperienceListProps = {
  children: React.ReactNode
  total: number
}

export function ExperienceList({ children, total }: ExperienceListProps) {
  const [expanded, setExpanded] = useState(false);
  const items = React.Children.toArray(children);
  const hidden = total - INITIAL_VISIBLE;
  const visible = expanded ? items : items.slice(0, INITIAL_VISIBLE);

  return (
    <div className="space-y-4">
      {visible}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex items-center gap-3 text-white/25 hover:text-white/50 transition-colors duration-200 cursor-pointer group py-1"
        >
          <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
          <span className="text-xs tracking-wide">
            {expanded ? "Show less" : `${hidden} more`}
          </span>
          <ChevronDownIcon
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
          <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
        </button>
      )}
    </div>
  );
}
