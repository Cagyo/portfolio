import projectsJson from "./projects-data.json"

export type ProjectPageLink =
  | { type: "web"; url: string }
  | { type: "web+mobile"; url: string; appStore: string; playStore: string }
  | { type: "mobile"; appStore: string; playStore: string }
  | { type: "private" }

export type ProjectData = {
  id: number
  title: string
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
}

export type FilterGroupConfig = {
  key: string
  label: string
  options: string[]
  match: (project: ProjectData, values: string[]) => boolean
}

export const PROJECTS: ProjectData[] = projectsJson as ProjectData[]

export const FILTER_GROUPS: FilterGroupConfig[] = [
  {
    key: "devTypes",
    label: "Type",
    options: ["Mobile", "Full Stack", "Web", "Backend"],
    match: (project, values) => values.some((value) => project.devTypes.includes(value)),
  },
  {
    key: "role",
    label: "Role",
    options: ["Developer", "Mobile Lead", "Full-Stack Lead", "Tech Lead"],
    match: (project, values) => values.includes(project.role),
  },
  {
    key: "industry",
    label: "Industry",
    options: ["Fintech", "Sports", "Services", "Gov", "Social", "IoT", "Healthcare", "Enterprise"],
    match: (project, values) => values.includes(project.industry),
  },
  {
    key: "scale",
    label: "Scale",
    options: ["Solo build", "Team", "Personal project"],
    match: (project, values) => values.includes(project.scale),
  },
  {
    key: "stackFilters",
    label: "Stack",
    options: ["React Native", "NestJS", "Next.js", "GraphQL", "AWS"],
    match: (project, values) => values.some((value) => project.stackFilters.includes(value)),
  },
  {
    key: "company",
    label: "Company",
    options: ["Personal", "Avocado Technology", "Allsquare", "EngagePoint"],
    match: (project, values) => values.includes(project.company),
  },
];
