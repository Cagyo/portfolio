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

export function HomeFaqList({ items, tracks }: HomeFaqListProps) {
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => new Set());

  const handleToggle = useCallback((item: FaqItemData) => {
    setOpenSlugs((previousSlugs) => {
      const nextSlugs = new Set(previousSlugs);

      if (nextSlugs.has(item.slug)) {
        nextSlugs.delete(item.slug);
        return nextSlugs;
      }

      nextSlugs.add(item.slug);
      trackFaqOpen({ slug: item.slug, track: item.track, location: "home_section" });
      return nextSlugs;
    });
  }, []);

  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <div className={styles.columns}>
      {columns.map((columnItems, columnIndex) => (
        <ul key={columnIndex} className={styles.list}>
          {columnItems.map((item, itemIndex) => {
            const previousItem = itemIndex > 0 ? columnItems[itemIndex - 1] : undefined;
            const eyebrow = previousItem?.track === item.track ? undefined : tracks[item.track].eyebrow;

            return (
              <FaqItem
                key={item.slug}
                item={item}
                isOpen={openSlugs.has(item.slug)}
                onToggle={() => handleToggle(item)}
                eyebrow={eyebrow}
                eyebrowClassName={styles.eyebrow}
              />
            );
          })}
        </ul>
      ))}
    </div>
  );
}
