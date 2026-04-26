import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))
vi.mock("next-intl/server", () => ({
  getLocale: async () => "en",
}))

import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"
import { getProjectBySlug, getProjects } from "./get-projects"

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

describe("project slugs", () => {
  it("every project base has a slug in kebab-case", () => {
    for (const base of PROJECT_BASES) {
      expect(base.slug, `id ${base.id} missing slug`).toBeTruthy()
      expect(base.slug, `id ${base.id} slug "${base.slug}" not kebab-case`).toMatch(
        SLUG_PATTERN,
      )
    }
  })

  it("slugs are unique across all projects", () => {
    const seen = new Map<string, number>()
    for (const base of PROJECT_BASES) {
      const previous = seen.get(base.slug)
      expect(
        previous,
        `slug "${base.slug}" used by both id ${previous} and id ${base.id}`,
      ).toBeUndefined()
      seen.set(base.slug, base.id)
    }
  })

  it("NDA slugs do not leak any real-name token (link.type === 'private')", () => {
    for (const base of PROJECT_BASES) {
      if (base.link.type !== "private") continue
      const content = PROJECT_CONTENT_EN[base.id]
      const titleTokens = new Set(tokenize(content.title))
      const genericTokens = new Set(tokenize(content.titleGeneric))
      const slugTokens = tokenize(base.slug)
      const titleOnly = [...titleTokens].filter((token) => !genericTokens.has(token))
      const leaked = slugTokens.filter((token) => titleOnly.includes(token))
      expect(
        leaked,
        `NDA slug "${base.slug}" (id ${base.id}) leaks real-name token(s) ${JSON.stringify(
          leaked,
        )} from title "${content.title}"`,
      ).toEqual([])
    }
  })
})

describe("getProjectBySlug", () => {
  it("resolves every authored slug", async () => {
    for (const base of PROJECT_BASES) {
      const project = await getProjectBySlug(base.slug)
      expect(project, `slug "${base.slug}" did not resolve`).toBeDefined()
      expect(project?.id).toBe(base.id)
    }
  })

  it("normalises case", async () => {
    const first = PROJECT_BASES[0]
    const project = await getProjectBySlug(first.slug.toUpperCase())
    expect(project?.id).toBe(first.id)
  })

  it("returns undefined for unknown slugs", async () => {
    expect(await getProjectBySlug("does-not-exist")).toBeUndefined()
    expect(await getProjectBySlug("")).toBeUndefined()
  })
})

describe("project prose word-count audit (PR 4 input)", () => {
  function wordCount(value: string | undefined): number {
    if (!value) return 0
    return value.split(/\s+/).filter(Boolean).length
  }

  it("emits a per-project word-count table (warning only)", async () => {
    const projects = await getProjects()
    const rows = projects
      .map((project) => {
        const total =
          wordCount(project.problem) +
          wordCount(project.description) +
          wordCount(project.achievements.join(" ")) +
          wordCount(project.duties.join(" ")) +
          wordCount(project.teamDetail) +
          wordCount(project.skills) +
          wordCount(project.approach)
        return { id: project.id, slug: project.slug, words: total }
      })
      .sort((a, b) => a.words - b.words)

    // Emit the table for PR 4's content-gate decisions. Not an assertion.
    console.table(rows)

    // The only failing condition is a missing slug (already covered above);
    // this block exists to surface counts during CI so PR 4 can act on them.
    for (const row of rows) {
      expect(row.slug).toBeTruthy()
    }
  })
})
