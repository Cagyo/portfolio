export type { ProjectData, ProjectPageLink } from "../../_data/projects-data"
export { PROJECTS, getProjectTitle } from "../../_data/projects-data"

import type { ProjectData } from "../../_data/projects-data"

export type FilterGroupConfig = {
  key: string
  label: string
  options: string[]
  match: (project: ProjectData, values: string[]) => boolean
}

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
