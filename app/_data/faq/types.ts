export type TrackKey = "scratch" | "rescue" | "universal";

export type FaqBase = { slug: string; track: TrackKey };
export type FaqContent = { question: string; answer: string; body: string };
export type TrackMeta = { eyebrow: string; heading: string };
export type TrackMetaMap = Record<TrackKey, TrackMeta>;

export type FaqItem = FaqBase & FaqContent;
export type FaqData = {
  sectionTitle: string;
  tracks: TrackMetaMap;
  items: FaqItem[];
  homeFeaturedItems: FaqItem[];
};
