import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"
import { getHeroLogoProjects } from "./get-hero-logo-projects"

describe("home hero logos", () => {
  it("every homeHero project has an existing public logo asset", () => {
    const missing = PROJECT_BASES.filter(
      (project) =>
        project.homeHero &&
        (!project.logo ||
          !existsSync(join(process.cwd(), "public", project.logo.replace(/^\//, "")))),
    )

    expect(missing).toEqual([])
  })

  it("uses real public project names as accessible logo text", () => {
    const projects = PROJECT_BASES.map((base) => ({
      ...base,
      ...PROJECT_CONTENT_EN[base.id],
    }))
    const heroLogos = getHeroLogoProjects(projects)

    expect(heroLogos.map((logo) => logo.title)).toEqual([
      "Omega European Masters",
      "Golfcrans",
      "B-Sharpe",
      "PinClean",
      "Yamback",
    ])
  })
})