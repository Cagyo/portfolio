"use client";

import { useCallback, useState } from "react";
import { trackFaqOpen } from "@/app/_analytics/analytics";
import type { FaqItem as FaqItemData, TrackMetaMap } from "@/app/_data/faq/types";
import { FaqItem } from "@/app/faq/_components/FaqItem";
import styles from "./FaqSection.module.css";

type HomeFaqListProps = {
  items: FaqItemData[];
  tracks: TrackMetaMap;
};
type HomeFaqGroup = {
  track: FaqItemData["track"];
  items: FaqItemData[];
};

function getGroupsByTrack(items: FaqItemData[]): HomeFaqGroup[] {
  const groups: HomeFaqGroup[] = [];
  const groupByTrack = new Map<FaqItemData["track"], HomeFaqGroup>();

  for (const item of items) {
    const existingGroup = groupByTrack.get(item.track);

    if (existingGroup) {
      existingGroup.items.push(item);
      continue;
    }

    const nextGroup = { track: item.track, items: [item] };
    groupByTrack.set(item.track, nextGroup);
    groups.push(nextGroup);
  }

  return groups;
}


export function HomeFaqList({ items, tracks }: HomeFaqListProps) {
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => new Set());

  const handleToggle = useCallback((item: FaqItemData) => {
    let isOpening = false;

    setOpenSlugs((previousSlugs) => {
      const nextSlugs = new Set(previousSlugs);
      isOpening = !nextSlugs.has(item.slug);

      if (isOpening) {
        nextSlugs.add(item.slug);
      } else {
        nextSlugs.delete(item.slug);
      }

      return nextSlugs;
    });

    if (isOpening) {
      trackFaqOpen({ slug: item.slug, track: item.track, location: "home_section" });
    }
  }, []);

  const groups = getGroupsByTrack(items);

  if (groups.length === 0) return null;

  return (
    <div className={styles.trackGrid}>
      {groups.map((group) => {
        const trackMeta = tracks[group.track];
        const headingId = `home-faq-${group.track}-heading`;

        return (
          <section key={group.track} className={styles.trackGroup} aria-labelledby={headingId}>
            <header className={styles.trackHeader}>
              <p className={styles.trackEyebrow} id={trackMeta.heading ? undefined : headingId}>
                {trackMeta.eyebrow}
              </p>
              {trackMeta.heading && (
                <h3 className={styles.trackHeading} id={headingId}>
                  {trackMeta.heading}
                </h3>
              )}
            </header>

            <ul className={styles.list}>
              {group.items.map((item) => (
                <FaqItem
                  key={item.slug}
                  item={item}
                  isOpen={openSlugs.has(item.slug)}
                  onToggle={() => handleToggle(item)}
                  itemClassName={styles.item}
                  buttonClassName={styles.itemButton}
                  panelContentClassName={styles.itemPanel}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
