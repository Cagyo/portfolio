import type { Project } from "./types"

export type HeroLogoProject = {
  slug: string
  logo: string
  title: string
}

export function getHeroLogoProjects(projects: Project[]): HeroLogoProject[] {
  return projects
    .filter(
      (project) =>
        project.homeHero === true &&
        project.logo,
    )
    .map((project) => ({
      slug: project.slug,
      logo: project.logo!,
      title: project.title,
    }))
}