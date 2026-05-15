"use client";

import { useId, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { ExpandSection } from "@/app/_components/expand-section/ExpandSection";
import type { ProjectStackGroup } from "@/app/_data/projects/stack-groups";
import styles from "./project-detail.module.css";

type StackEvidenceProps = {
  primaryGroups: ProjectStackGroup[];
  secondaryGroups: ProjectStackGroup[];
  showMoreLabel: string;
  showLessLabel: string;
};

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
    <div className={styles.stackEvidence}>
      <StackGroupList groups={primaryGroups} />
      {secondaryGroups.length > 0 ? (
        <ExpandSection
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
          expandLabel={showMoreLabel}
          collapseLabel={showLessLabel}
          buttonClassName={styles.stackToggle}
          panelId={panelId}
        >
          {isExpanded ? (
            <div className={styles.stackSecondary}>
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
    <div className={styles.stackGroupList}>
      {groups.map((group) => (
        <div key={group.category} className={styles.stackGroup}>
          <p className={styles.stackCategory}>{group.category}</p>
          <div className={styles.stackChipRow}>
            {group.entries.map((stackEntry) => (
              <Link
                key={stackEntry.name}
                href={`/projects?stackFilters=${encodeURIComponent(stackEntry.name)}`}
                className={styles.linkChip}
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
