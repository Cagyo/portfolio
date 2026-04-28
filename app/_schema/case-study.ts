import { siteConfig } from "@/app/_config/site-config";
import { getProjectTitle, type Project } from "@/app/_data/projects/types";
import { absoluteUrl } from "./absolute-url";

/**
 * schema.org Article emitted on every per-project case-study page.
 *
 * Per-project Article rules:
 *   - `author` is a REFERENCE (`@id`) to the root-layout Person, never inline.
 *     (Same pattern as item-list.ts — Person/WebSite are emitted once in the
 *     root layout; everything else references them by `@id`.)
 *   - `about` carries the WebApplication / SoftwareApplication node for
 *     public projects — preserves the "this person built that live product"
 *     signal even after `ItemList` URLs become internal in PR 3.
 *   - For NDA / private projects: `about` is OMITTED entirely. We don't
 *     leak product identity into structured data.
 *   - `datePublished` derives from the start year of `project.year`. Year
 *     ranges like "2022–2026" can't go directly into `datePublished`.
 */

const PERSON_ID = `${siteConfig.url.replace(/\/$/, "")}/#person`;

function parseStartYear(year: string): number {
  const match = year.match(/(\d{4})/);
  return match ? Number(match[1]) : new Date().getFullYear();
}

function applicationCategoryFor(project: Project): string {
  if (project.devTypes.includes("Mobile") && project.devTypes.length === 1) {
    return "MobileApplication";
  }
  if (project.industry === "Fintech") return "FinanceApplication";
  if (project.industry === "Healthcare") return "HealthApplication";
  return "BusinessApplication";
}

function buildAboutNode(project: Project): Record<string, unknown> | undefined {
  const link = project.link;
  const name = getProjectTitle(project);

  switch (link.type) {
    case "web": {
      return {
        "@type": "WebApplication",
        name,
        applicationCategory: applicationCategoryFor(project),
        operatingSystem: "Web",
        sameAs: [link.url],
      };
    }
    case "web+mobile": {
      return {
        "@type": "WebApplication",
        name,
        applicationCategory: applicationCategoryFor(project),
        operatingSystem: "Web, iOS, Android",
        sameAs: [link.url, link.appStore, link.playStore],
      };
    }
    case "mobile": {
      return {
        "@type": "SoftwareApplication",
        name,
        applicationCategory: applicationCategoryFor(project),
        operatingSystem: "iOS, Android",
        sameAs: [link.appStore, link.playStore],
      };
    }
    case "private":
      return undefined;
  }
}

export type CaseStudySchemaInput = {
  project: Project
  /** Canonical absolute URL of the per-project page. */
  pageUrl: string
  /** Absolute URL of the page's OG image. */
  imageUrl: string
};

export function buildCaseStudySchema({
  project,
  pageUrl,
  imageUrl,
}: CaseStudySchemaInput): Record<string, unknown> {
  const headline = project.seoTitle ?? getProjectTitle(project);
  const datePublished = `${parseStartYear(project.year)}-01-01`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    datePublished,
    image: imageUrl,
    mainEntityOfPage: pageUrl,
    author: { "@id": PERSON_ID },
  };

  const description = project.problem ?? project.description.slice(0, 160);
  if (description) schema.description = description;

  const about = buildAboutNode(project);
  if (about) schema.about = about;

  return schema;
}

export { PERSON_ID as _CASE_STUDY_PERSON_ID, parseStartYear as _parseStartYear };

export function caseStudyPath(slug: string): string {
  return `/projects/${slug}`;
}

export function caseStudyImagePath(slug: string): string {
  return `/projects/${slug}/opengraph-image`;
}

export function buildCaseStudyUrls(slug: string): { pageUrl: string; imageUrl: string } {
  return {
    pageUrl: absoluteUrl(caseStudyPath(slug)),
    imageUrl: absoluteUrl(caseStudyImagePath(slug)),
  };
}
