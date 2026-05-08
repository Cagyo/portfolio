"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { trackFaqOpen } from "@/app/_analytics/analytics";
import type { FaqItem as FaqItemData, TrackMetaMap } from "@/app/_data/faq/types";
import { FaqItem } from "./FaqItem";
import styles from "./FaqList.module.css";

type FaqListProps = {
  items: FaqItemData[];
  tracks: TrackMetaMap;
  renderEyebrowOnFirstItem?: boolean;
};

export function FaqList({ items, tracks, renderEyebrowOnFirstItem = false }: FaqListProps) {
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => new Set());
  const itemBySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const track = items[0]?.track;
  const trackMeta = track ? tracks[track] : undefined;

  useEffect(() => {
    let animationFrame: number | undefined;

    function openFromHash() {
      const hashSlug = window.location.hash.slice(1);
      if (!hashSlug || !itemBySlug.has(hashSlug)) return;

      setOpenSlugs((previousSlugs) => {
        if (previousSlugs.has(hashSlug)) return previousSlugs;
        const nextSlugs = new Set(previousSlugs);
        nextSlugs.add(hashSlug);
        return nextSlugs;
      });

      animationFrame = window.requestAnimationFrame(() => {
        document.getElementById(hashSlug)?.scrollIntoView({ block: "start" });
      });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => {
      window.removeEventListener("hashchange", openFromHash);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [itemBySlug]);

  const handleToggle = useCallback((item: FaqItemData) => {
    const isOpening = !openSlugs.has(item.slug);
    const nextSlugs = new Set(openSlugs);
    if (isOpening) {
      nextSlugs.add(item.slug);
    } else {
      nextSlugs.delete(item.slug);
    }
    setOpenSlugs(nextSlugs);

    if (isOpening) {
      window.history.replaceState(null, "", `#${item.slug}`);
      trackFaqOpen({ slug: item.slug, track: item.track, location: "faq_page" });
    } else if (window.location.hash.slice(1) === item.slug) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, [openSlugs]);

  if (items.length === 0) return null;

  return (
    <>
      {renderEyebrowOnFirstItem && trackMeta && (
        <header className={styles.trackHeader}>
          <p className={styles.trackEyebrow}>{trackMeta.eyebrow}</p>
          {trackMeta.heading && <h2 className={styles.trackHeading}>{trackMeta.heading}</h2>}
        </header>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <FaqItem
            key={item.slug}
            item={item}
            isOpen={openSlugs.has(item.slug)}
            onToggle={() => handleToggle(item)}
          />
        ))}
      </ul>
    </>
  );
}
