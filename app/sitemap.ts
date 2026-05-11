import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/app/_schema/absolute-url'
import { caseStudyPath } from '@/app/_schema/case-study'
import { getProjects } from '@/app/_data/projects/get-projects'
import { isThinContent } from '@/app/_data/projects/is-thin-content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const projects = await getProjects()
  const thin = projects.filter((project) => isThinContent(project));
  if (thin.length > 0) {
    console.warn(
      `[sitemap] Excluded ${thin.length} thin-content project(s): ${thin.map((project) => project.slug).join(", ")}`,
    );
  }
  const projectEntries = projects
    .filter((project) => !isThinContent(project))
    .map((project) => ({
      url: absoluteUrl(caseStudyPath(project.slug)),
      lastModified: project.updatedAt,
    }))

  return [
    { url: absoluteUrl('/'), lastModified },
    { url: absoluteUrl('/faq'), lastModified },
    { url: absoluteUrl('/projects'), lastModified },
    { url: absoluteUrl('/privacy'), lastModified },
    // { url: absoluteUrl('/mentorship'), lastModified },
    ...projectEntries,
  ]
}
