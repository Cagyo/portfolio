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

/**
 * Hex-valued gradient definition for `next/og` `ImageResponse` rendering.
 * Tailwind classes can't be evaluated by `next/og`, so OG-image artwork
 * needs raw hex stops. Used by per-project OG routes (PR 2).
 */
export type OgGradient = {
  from: string
  via?: string
  to: string
  dir: "br" | "r" | "b"
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
  /**
   * URL slug for the per-project detail page (`/projects/{slug}`).
   *
   * Slug authoring rules — must be hand-authored, never derived at runtime,
   * and stable forever once published (do NOT change post-publish):
   *
   * - **Public projects** (`link.type !== "private"`): derive from the real
   *   product name. Real-name signals help SEO. e.g. `omega-european-masters`.
   * - **NDA / private projects** (`link.type === "private"`): derive from
   *   `titleGeneric` only. The slug must NOT contain any token from `title`
   *   that's absent from `titleGeneric` — putting the real product name in
   *   the URL would defeat the `SHOW_REAL_PROJECT_NAMES` toggle that exists
   *   to protect the NDA. e.g. `on-demand-car-wash`, NOT `pinclean`.
   *
   * Slugs are stable across `SHOW_REAL_PROJECT_NAMES` toggles. The NDA
   * leak guard is enforced by a Vitest test in `slug.test.ts`.
   */
  slug: string
  /**
   * Optional ISO 8601 date string (YYYY-MM-DD) of the most recent meaningful
   * content revision. Consumed by `app/sitemap.ts` (`lastModified`) in PR 4.
   * Falls back to `${parseStartYear(year)}-01-01` when omitted.
   */
  updatedAt?: string
  /**
   * Optional hex-valued gradient backing the per-project OG image hero.
   * Required when the project relies on Tailwind-only `imageBg` and ships
   * an `opengraph-image.tsx` route (PR 2). Falls back to a neutral default.
   */
  ogGradient?: OgGradient
}

export type ProjectHomeCard = {
  problem: string
  outcome: string[]
  buyerBadge: string
}

export type ProjectShape = "greenfield" | "mature"

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
  shapes: ProjectShape[]
  description: string
  problem?: string
  achievements: string[]
  duties: string[]
  badgeLabel?: string
  homeCard?: ProjectHomeCard
  /**
   * Optional override for the per-project page `<title>` and `og:title`.
   * Cloaking constraint (enforced by a Vitest test in PR 2): every token
   * (after stopword removal) must also appear in either `getProjectTitle`
   * output or the visible body fields rendered on the page.
   */
  seoTitle?: string
  /**
   * Optional 3–5 sentence narrative on the technical approach and key
   * decisions. Rendered as its own section on the per-project page (PR 2).
   */
  approach?: string
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
