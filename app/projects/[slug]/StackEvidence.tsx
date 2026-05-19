"use client";

import { useId, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { ExpandSection } from "@/app/_components/expand-section/ExpandSection";
import type { ProjectStackGroup } from "@/app/_data/projects/stack-groups";

type StackEvidenceProps = {
  primaryGroups: ProjectStackGroup[];
  secondaryGroups: ProjectStackGroup[];
  showMoreLabel: string;
  showLessLabel: string;
};

const stackToggleClass =
  "inline-flex items-center self-start min-h-11 gap-2 p-0 text-amber-foreground text-xs font-bold cursor-pointer transition-colors duration-200 hover:text-amber-foreground/80 focus-visible:outline-2 focus-visible:outline-amber-foreground focus-visible:outline-offset-4 focus-visible:rounded-md";

const linkChipClass =
  "inline-flex items-center min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground no-underline transition-[background-color,border-color,color] duration-200 hover:bg-card-hover hover:border-foreground/20 hover:text-foreground max-sm:min-h-11";

export function StackEvidence({
  primaryGroups,
  secondaryGroups,
  showMoreLabel,
  showLessLabel,
}: StackEvidenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const generatedPanelId = useId();

  // Reset transient disclosure state on route cache unmount (Activity guidance)
  useLayoutEffect(() => {
    return () => setIsExpanded(false);
  }, []);
  const panelId = `${generatedPanelId}-secondary-stack`;

  return (
    <div className="flex flex-col gap-4 max-w-[44ch]">
      <StackGroupList groups={primaryGroups} />
      {secondaryGroups.length > 0 ? (
        <ExpandSection
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
          expandLabel={showMoreLabel}
          collapseLabel={showLessLabel}
          buttonClassName={stackToggleClass}
          panelId={panelId}
        >
          {isExpanded ? (
            <div className="mt-1 pt-3.5 border-t border-border">
              <StackGroupList groups={secondaryGroups} />
            </div>
          ) : null}
        </ExpandSection>
      ) : null}
    </div>
  );
}

function StackGroupList({ groups }: { groups: ProjectStackGroup[] }) {
  return (
    <div className="grid gap-0">
      {groups.map((group) => (
        <div
          key={group.category}
          className="grid grid-cols-[minmax(7rem,10rem)_minmax(0,1fr)] gap-y-3 gap-x-4 items-start py-3.5 border-t border-border first:pt-0 first:border-t-0 max-sm:grid-cols-1 max-sm:gap-2"
        >
          <p className="mt-[0.45rem] mb-0 text-faint-foreground/85 text-[0.65rem] font-semibold tracking-[0.12em] uppercase max-sm:mt-0">
            {group.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.entries.map((stackEntry) => (
              <Link
                key={stackEntry.name}
                href={`/projects?stackFilters=${encodeURIComponent(stackEntry.name)}`}
                className={linkChipClass}
                prefetch={false}
              >
                {stackEntry.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
