import "server-only"
import { getLocale } from "next-intl/server"
import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"
import type { Project } from "./types"

const CONTENT_BY_LOCALE = { en: PROJECT_CONTENT_EN } as const

const SLUG_TO_ID: ReadonlyMap<string, number> = new Map(
  PROJECT_BASES.map((base) => [base.slug.toLowerCase(), base.id]),
)

export async function getProjects(): Promise<Project[]> {
  const locale = await getLocale()
  const content =
    CONTENT_BY_LOCALE[locale as keyof typeof CONTENT_BY_LOCALE] ?? PROJECT_CONTENT_EN
  return PROJECT_BASES.map((base) => {
    const merged = { ...base, ...content[base.id] }
    return merged.screenshots
      ? { ...merged, screenshots: merged.screenshots.slice(0, 3) }
      : merged
  })
}

/**
 * Look up a project by URL slug. O(1) via a module-scope Map.
 *
 * Input is normalised to lowercase before lookup. Callers (the per-project
 * page in PR 2) should compare the resolved project's canonical slug against
 * the raw input and `redirect()` to the canonical URL when they differ,
 * rather than 404-ing on a casing mismatch.
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const id = SLUG_TO_ID.get(slug.toLowerCase())
  if (id === undefined) return undefined
  const projects = await getProjects()
  return projects.find((project) => project.id === id)
}

