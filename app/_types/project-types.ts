export type ProjectLink =
  | { type: "web"; url: string }
  | { type: "stores"; appStore: string; playStore: string }
  | { type: "private" }

export type Project = {
  id: string
  title: string
  description: string
  meta: { category: string; role: string; year: string }
  badge: { icon: string; label: string }
  tags: string[]
  imageBg: string
  link: ProjectLink
  featured?: boolean
}
