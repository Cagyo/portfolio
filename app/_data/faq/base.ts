import type { FaqBase, TrackKey } from "./types";

export const FAQ_TRACK_ORDER = ["scratch", "rescue", "universal"] as const satisfies readonly TrackKey[];

export const FAQ_BASES: readonly FaqBase[] = [
  { slug: "no-technical-cofounder-where-start", track: "scratch" },
  { slug: "how-will-i-know-things-are-on-track", track: "scratch" },
  { slug: "how-do-we-communicate-during-project", track: "scratch" },
  { slug: "cost-fixed-price-or-hourly", track: "scratch" },
  { slug: "code-ownership-on-parting-ways", track: "scratch" },
  { slug: "how-involved-do-i-need-to-be", track: "scratch" },
  { slug: "ai-tools-takeover", track: "rescue" },
  { slug: "rescue-vs-more-features", track: "rescue" },
  { slug: "app-breaking-under-real-users", track: "rescue" },
  { slug: "mvp-not-in-your-stack", track: "rescue" },
  { slug: "rescue-cost-vs-starting-over", track: "rescue" },
  { slug: "what-i-can-keep-doing-with-ai", track: "rescue" },
  { slug: "when-can-you-start", track: "universal" },
  { slug: "ndas-and-code-ownership", track: "universal" },
  { slug: "working-across-time-zones", track: "universal" },
] as const;

export const HOME_FEATURED_SLUGS = [
  "no-technical-cofounder-where-start",
  "cost-fixed-price-or-hourly",
  "ai-tools-takeover",
  "rescue-cost-vs-starting-over",
] as const;
