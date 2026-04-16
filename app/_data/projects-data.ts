import projectsJson from "./projects-data.json"

export type ProjectPageLink =
  | { type: "web"; url: string }
  | { type: "web+mobile"; url: string; appStore: string; playStore: string }
  | { type: "mobile"; appStore: string; playStore: string }
  | { type: "private" }

export type OverlayType = "live-lg" | "live-stores" | "stores" | "private"

export function overlayTypeFor(link: ProjectPageLink): OverlayType {
  switch (link.type) {
    case "web": return "live-lg"
    case "web+mobile": return "live-stores"
    case "mobile": return "stores"
    case "private": return "private"
  }
}

export type ProjectData = {
  id: number
  title: string
  titleGeneric: string
  company: string
  industry: string
  productType: string
  devTypes: string[]
  role: string
  skills: string
  teamLabel: string
  teamDetail: string
  scale: string
  description: string
  achievements: string[]
  duties: string[]
  stack: string[]
  stackFilters: string[]
  year: string
  link: ProjectPageLink
  featured?: boolean
  badgeLabel?: string
  imageBg?: string
}

/**
 * Toggle between real project names and generic display titles.
 * Set to `true` to show real names (e.g. "Omega European Masters"),
 * `false` to show generic titles (e.g. "Golf Tournament Platform").
 */
export const SHOW_REAL_PROJECT_NAMES = false

export function getProjectTitle(project: ProjectData): string {
  return SHOW_REAL_PROJECT_NAMES ? project.title : project.titleGeneric
}

export const PROJECTS: ProjectData[] = projectsJson as ProjectData[]
