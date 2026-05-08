import "server-only";
import { getLocale } from "next-intl/server";
import { FAQ_BASES, HOME_FEATURED_SLUGS } from "./base";
import { FAQ_CONTENT_EN, FAQ_SECTION_TITLE_EN, FAQ_TRACKS_EN } from "./content.en";
import type { FaqData, FaqItem } from "./types";

const CONTENT_BY_LOCALE = {
  en: {
    items: FAQ_CONTENT_EN,
    tracks: FAQ_TRACKS_EN,
    sectionTitle: FAQ_SECTION_TITLE_EN,
  },
} as const;

export async function getFaq(): Promise<FaqData> {
  const locale = await getLocale();
  const content = CONTENT_BY_LOCALE[locale as keyof typeof CONTENT_BY_LOCALE] ?? CONTENT_BY_LOCALE.en;
  const items: FaqItem[] = FAQ_BASES.map((base) => ({ ...base, ...content.items[base.slug] }));
  const homeFeaturedItems = HOME_FEATURED_SLUGS
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is FaqItem => item !== undefined);

  return {
    sectionTitle: content.sectionTitle,
    tracks: content.tracks,
    items,
    homeFeaturedItems,
  };
}
