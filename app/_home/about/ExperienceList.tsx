'use client'

import React from "react";
import { ChevronDownIcon } from "../../../assets/icons/ChevronDownIcon";
import { useShowMore } from "../../_components/show-more/use-show-more";

const INITIAL_VISIBLE = 2

type ExperienceListProps = {
  children: React.ReactNode
  total: number
}

export function ExperienceList({ children, total }: ExperienceListProps) {
  const { expanded, toggle, hiddenCount } = useShowMore(total, INITIAL_VISIBLE);
  const allItems = React.Children.toArray(children);
  const initialItems = allItems.slice(0, INITIAL_VISIBLE);
  const extraItems = allItems.slice(INITIAL_VISIBLE);
  return (
    <div className="space-y-4">
      {initialItems}
      {extraItems.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={{ overflow: "hidden", minHeight: 0 }} className="space-y-4 pt-4">
            {extraItems}
          </div>
        </div>
      )}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={toggle}
          className="w-full flex items-center gap-3 text-white/25 hover:text-white/50 transition-colors duration-200 cursor-pointer group py-1"
        >
          <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
          <span className="text-xs tracking-wide">
            {expanded ? "Show less" : `${hiddenCount} more`}
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
