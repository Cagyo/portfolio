import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/app/_data/projects/get-projects'
import { getProjectTitle } from '@/app/_data/projects/types'
import { renderOg, size, contentType } from '@/app/_og/og-template'

export { size, contentType }
export const alt = 'Project case study — Oleksii Berliziev portfolio'

// Static per slug; image is regenerated only on deploy.
export const revalidate = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function Image({
  params,
}: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  // Soft cap for the OG card; the template warns at 110 chars.
  function truncate(text: string, max = 108): string {
    if (text.length <= max) return text
    const slice = text.slice(0, max)
    const cut = slice.replace(/\s+\S*$/, '')
    return `${cut.length ? cut : slice}\u2026`
  }
  const rawDescription =
    project.problem ?? project.description
  const description = truncate(rawDescription)

  return renderOg({
    eyebrow: project.link.type === 'private' ? 'CASE STUDY · NDA' : 'CASE STUDY',
    title: getProjectTitle(project),
    description,
  })
}
