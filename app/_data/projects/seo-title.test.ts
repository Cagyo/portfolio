import { describe, expect, it } from "vitest";
import { PROJECT_BASES } from "./base";
import { PROJECT_CONTENT_EN } from "./content.en";
import { getProjectTitle } from "./types";

/**
 * Cloaking constraint for `seoTitle` (per-project page title override).
 *
 * Every meaningful token in `seoTitle` (after stopword removal) MUST also
 * appear in the visible H1 (`getProjectTitle`) or one of the visible body
 * fields rendered on the page (description, problem, achievements, duties,
 * skills, teamDetail, role, company, industry, productType, devTypes).
 *
 * This prevents "cloaking" — promising keywords in the title that aren't
 * substantiated by the page body. Google flags this. So do humans.
 */

const STOPWORDS = new Set([
  "a", "an", "and", "the", "of", "for", "to", "in", "on", "at", "by",
  "with", "or", "as", "from", "is", "it", "this", "that", "into",
  "case", "study", "page", "platform", "app", "site", "website",
]);

function tokenize(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

describe("seoTitle cloaking constraint", () => {
  const projectsWithSeoTitle = PROJECT_BASES.filter(
    (base) => PROJECT_CONTENT_EN[base.id]?.seoTitle,
  );

  if (projectsWithSeoTitle.length === 0) {
    it("no project sets seoTitle yet \u2014 cloaking guard is dormant until backfill", () => {
      // Backfill happens in PR 4. This placeholder keeps the suite valid;
      // once any project receives a seoTitle, the per-project assertions below
      // start enforcing the constraint automatically.
      expect(projectsWithSeoTitle).toEqual([]);
    });
  }

  for (const base of projectsWithSeoTitle) {
    const content = PROJECT_CONTENT_EN[base.id];

    it(`id ${base.id} (${base.slug}): every seoTitle token appears in visible body`, () => {
      const visibleSources = [
        getProjectTitle(content),
        content.description,
        content.problem ?? "",
        content.skills,
        content.teamDetail,
        content.role,
        content.company,
        content.industry,
        content.productType,
        content.approach ?? "",
        ...content.devTypes,
        ...content.achievements,
        ...content.duties,
      ];
      const visibleTokens = new Set(visibleSources.flatMap(tokenize));

      const seoTitleTokens = tokenize(content.seoTitle);
      const missing = seoTitleTokens.filter((token) => !visibleTokens.has(token));

      expect(
        missing,
        `seoTitle "${content.seoTitle}" (id ${base.id}) introduces token(s) ` +
          `${JSON.stringify(missing)} that don't appear in any visible body field`,
      ).toEqual([]);
    });
  }
});
