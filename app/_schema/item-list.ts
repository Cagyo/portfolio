import { getProjectTitle, type Project } from "@/app/_data/projects/types";
import { absoluteUrl } from "./absolute-url";

/**
 * schema.org ItemList of projects. Emit ONLY on `/projects`.
 * Do NOT re-emit Person/WebSite — the root layout covers them.
 *
 * Every entry resolves to the project's per-slug case-study page on
 * berliziev.dev (PR 3). Public-product validation URLs (live site,
 * App Store, Play Store) are surfaced via `Article.about.sameAs` on the
 * detail page itself — not from the hub `ItemList`.
 *
 * Project names go through `getProjectTitle()` so JSON-LD always
 * mirrors the displayed title (respects `SHOW_REAL_PROJECT_NAMES`).
 * This prevents cloaking and keeps the test alignment guard meaningful.
 */
function urlForProject(project: Project): string {
  return absoluteUrl(`/projects/${project.slug}`);
}

export function buildProjectsItemListSchema(projects: Project[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getProjectTitle(project),
      url: urlForProject(project),
    })),
  };
}
