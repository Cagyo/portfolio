import { describe, expect, it } from "vitest";
import { FAQ_BASES, FAQ_TRACK_ORDER, HOME_FEATURED_SLUGS } from "./base";
import { FAQ_CONTENT_EN } from "./content.en";
import type { TrackKey } from "./types";

const FAQ_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getSlugSet(): Set<string> {
  return new Set(FAQ_BASES.map((base) => base.slug));
}

describe("FAQ data integrity", () => {
  it("keeps slugs unique and kebab-case", () => {
    const seen = new Set<string>();

    for (const base of FAQ_BASES) {
      expect(base.slug, `FAQ slug "${base.slug}" is not kebab-case`).toMatch(FAQ_SLUG_PATTERN);
      expect(seen.has(base.slug), `Duplicate FAQ slug "${base.slug}"`).toBe(false);
      seen.add(base.slug);
    }
  });

  it("uses only registered tracks", () => {
    const registeredTracks = new Set<TrackKey>(FAQ_TRACK_ORDER);

    for (const base of FAQ_BASES) {
      expect(registeredTracks.has(base.track), `FAQ slug "${base.slug}" has unknown track "${base.track}"`).toBe(true);
    }
  });

  it("keeps bases grouped contiguously by track", () => {
    const completedTracks = new Set<TrackKey>();
    let currentTrack = FAQ_BASES[0]?.track;

    for (const base of FAQ_BASES) {
      if (base.track === currentTrack) continue;

      if (currentTrack) completedTracks.add(currentTrack);
      expect(
        completedTracks.has(base.track),
        `FAQ track "${base.track}" reappears after another track started`,
      ).toBe(false);
      currentTrack = base.track;
    }
  });

  it("resolves every home-featured slug", () => {
    const slugs = getSlugSet();

    for (const slug of HOME_FEATURED_SLUGS) {
      expect(slugs.has(slug), `Home FAQ slug "${slug}" is missing from FAQ_BASES`).toBe(true);
    }
  });

  it("keeps base and content slugs in sync", () => {
    const baseSlugs = getSlugSet();
    const contentSlugs = new Set(Object.keys(FAQ_CONTENT_EN));

    for (const baseSlug of baseSlugs) {
      expect(contentSlugs.has(baseSlug), `FAQ content missing for slug "${baseSlug}"`).toBe(true);
    }

    for (const contentSlug of contentSlugs) {
      expect(baseSlugs.has(contentSlug), `FAQ content slug "${contentSlug}" has no base entry`).toBe(true);
    }
  });
});
