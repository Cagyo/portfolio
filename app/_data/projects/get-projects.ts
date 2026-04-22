import "server-only"
import { getLocale } from "next-intl/server"
import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"
import type { Project } from "./types"

const CONTENT_BY_LOCALE = { en: PROJECT_CONTENT_EN } as const

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
