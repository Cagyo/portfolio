import type { SkillName, StackFilterName } from "@/app/_data/skills-data"

export type ExtraStack = { name: string; extra: true }
export type StackEntry = SkillName | ExtraStack

export function getStackName(entry: StackEntry): string {
  return typeof entry === "string" ? entry : entry.name
}

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

export type Screenshot = {
  src: string
  kind: "web" | "mobile" | "blurred"
  alt: string
  width?: number
  height?: number
}

export type ProjectBase = {
  id: number
  year: string
  link: ProjectPageLink
  featured?: boolean
  imageBg?: string
  logo?: string
  screenshots?: Screenshot[]
  stackFilters: StackFilterName[]
  stack: StackEntry[]
}

export type ProjectHomeCard = {
  problem: string
  outcome: string[]
  buyerBadge: string
}

export type ProjectContent = {
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
  problem?: string
  achievements: string[]
  duties: string[]
  badgeLabel?: string
  homeCard?: ProjectHomeCard
}

export type Project = ProjectBase & ProjectContent

/**
 * Toggle between real project names and generic display titles.
 * Set to `true` to show real names (e.g. "Omega European Masters"),
 * `false` to show generic titles (e.g. "Golf Tournament Platform").
 */
export const SHOW_REAL_PROJECT_NAMES = false

export function getProjectTitle(project: Pick<Project, "title" | "titleGeneric">): string {
  return SHOW_REAL_PROJECT_NAMES ? project.title : project.titleGeneric
}
