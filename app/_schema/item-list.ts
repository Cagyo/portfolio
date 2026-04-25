import { getProjectTitle, type Project } from "@/app/_data/projects/types";
import { absoluteUrl } from "./absolute-url";

/**
 * schema.org ItemList of projects. Emit ONLY on `/projects`.
 * Do NOT re-emit Person/WebSite — the root layout covers them.
 *
 * URL resolution honours `link.type`:
 *   - web / web+mobile → external `link.url`
 *   - mobile           → external `link.appStore`
 *   - private          → in-page anchor `/projects#project-{id}`
 *
 * Project names go through `getProjectTitle()` so JSON-LD always
 * mirrors the displayed title (respects `SHOW_REAL_PROJECT_NAMES`).
 * This prevents cloaking and keeps the test alignment guard meaningful.
 */
function urlForProject(project: Project): string {
  switch (project.link.type) {
    case "web":
    case "web+mobile":
      return project.link.url;
    case "mobile":
      return project.link.appStore;
    case "private":
      return absoluteUrl(`/projects#project-${project.id}`);
  }
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
