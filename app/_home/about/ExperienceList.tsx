'use client'

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/app/_lib/cn";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";

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
    <div className="grid gap-4">
      {initialSlice}
      {hiddenCount > 0 && extraSlice && (
        <div
          id={panelId}
          className="grid [transition:grid-template-rows_0.4s_cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="grid gap-4 overflow-hidden min-h-0 pt-4">
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
          className="group grid grid-cols-[minmax(1rem,1fr)_auto_auto_minmax(1rem,1fr)] items-center gap-3 w-full py-1 text-ghost-foreground cursor-pointer transition-colors duration-200 hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-4 focus-visible:rounded-lg"
        >
          <span className="h-px border-t border-dashed border-foreground/[12%] transition-[border-color] duration-200 group-hover:border-foreground/[22%]" aria-hidden="true" />
          <span className="text-xs whitespace-nowrap">
            {expanded ? t("showLess") : t("showNMore", { count: hiddenCount })}
          </span>
          <ChevronDownIcon
            className={cn("w-3 h-3 flex-shrink-0 transition-transform duration-300 motion-reduce:transition-none", expanded && "rotate-180")}
          />
          <span className="h-px border-t border-dashed border-foreground/[12%] transition-[border-color] duration-200 group-hover:border-foreground/[22%]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
