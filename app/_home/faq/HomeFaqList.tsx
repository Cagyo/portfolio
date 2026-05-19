"use client";

import { useCallback, useState } from "react";
import { trackFaqOpen } from "@/app/_analytics/analytics";
import type { FaqItem as FaqItemData, TrackMetaMap } from "@/app/_data/faq/types";
import { FaqItem } from "@/app/faq/_components/FaqItem";

type HomeFaqListProps = {
  items: FaqItemData[];
  tracks: TrackMetaMap;
};
type HomeFaqGroup = {
  track: FaqItemData["track"];
  items: FaqItemData[];
};

const trackGridClassName = "grid items-start gap-5 lg:grid-cols-2 lg:gap-6";
const trackGroupClassName = "min-w-0 overflow-hidden rounded-lg border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--amber)_7%,transparent),transparent_42%),color-mix(in_srgb,var(--surface)_84%,transparent)] shadow-[0_22px_64px_color-mix(in_srgb,var(--amber)_8%,transparent)] [html[data-theme=light]_&]:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--amber)_9%,transparent),transparent_44%),var(--surface)] [html[data-theme=light]_&]:shadow-[0_22px_64px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]";
const trackHeaderClassName = "border-b border-border px-5 pb-4 pt-5";
const trackEyebrowClassName = "inline-flex w-fit items-center rounded-full border border-[color-mix(in_srgb,var(--amber)_24%,transparent)] bg-amber/8 px-[0.65rem] py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-amber-foreground [html[data-theme=light]_&]:border-[var(--tag-border)] [html[data-theme=light]_&]:bg-[var(--tag-bg)] [html[data-theme=light]_&]:text-[var(--tag-color)]";
const trackHeadingClassName = "mt-3 font-heading text-[clamp(1.15rem,1vw_+_0.95rem,1.45rem)] font-black leading-[1.12] text-foreground";
const listClassName = "m-0 grid list-none p-[0.55rem]";
const itemClassName = "border-t border-border first:border-t-0";
const itemButtonClassName = "home-faq-button min-h-16 rounded-md border-transparent bg-transparent p-4 shadow-none hover:translate-y-0 hover:border-[color-mix(in_srgb,var(--amber)_18%,transparent)] hover:bg-foreground/6 hover:shadow-none aria-expanded:border-[color-mix(in_srgb,var(--amber)_28%,transparent)] aria-expanded:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--amber)_10%,transparent),transparent_88%)] [&>svg]:text-amber-foreground/85 [html[data-theme=light]_&]:hover:border-border-amber [html[data-theme=light]_&]:hover:bg-[color-mix(in_srgb,var(--amber)_7%,transparent)] [html[data-theme=light]_&]:aria-expanded:border-border-amber [html[data-theme=light]_&]:[&>svg]:text-[var(--tag-color)]";
const itemPanelClassName = "border-b border-[color-mix(in_srgb,var(--amber)_16%,transparent)] px-4 pb-[1.1rem] pt-[0.15rem] [html[data-theme=light]_&]:border-[color-mix(in_srgb,var(--amber-dark)_22%,transparent)]";

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
    <div className={trackGridClassName}>
      {groups.map((group) => {
        const trackMeta = tracks[group.track];
        const headingId = `home-faq-${group.track}-heading`;

        return (
          <section key={group.track} className={trackGroupClassName} aria-labelledby={headingId}>
            <header className={trackHeaderClassName}>
              <p className={trackEyebrowClassName} id={trackMeta.heading ? undefined : headingId}>
                {trackMeta.eyebrow}
              </p>
              {trackMeta.heading && (
                <h3 className={trackHeadingClassName} id={headingId}>
                  {trackMeta.heading}
                </h3>
              )}
            </header>

            <ul className={listClassName}>
              {group.items.map((item) => (
                <FaqItem
                  key={item.slug}
                  item={item}
                  isOpen={openSlugs.has(item.slug)}
                  onToggle={() => handleToggle(item)}
                  itemClassName={itemClassName}
                  buttonClassName={itemButtonClassName}
                  panelContentClassName={itemPanelClassName}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
