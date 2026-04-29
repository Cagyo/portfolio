import type { Project } from "./projects/types"
import { STACK_FILTER_NAMES } from "./skills-data"

export type FilterGroupConfig = {
  key: string
  label: string
  options: string[]
  match: (project: Project, values: string[]) => boolean
}

export const FILTER_GROUPS: FilterGroupConfig[] = [
  {
    key: "devTypes",
    label: "Type",
    options: ["Mobile", "Full Stack", "Web", "Backend"],
    match: (project, values) => values.every((value) => project.devTypes.includes(value)),
  },
  {
    key: "industry",
    label: "Industry",
    options: ["Fintech", "Sports", "Services", "Gov", "Social", "IoT", "Healthcare", "Enterprise"],
    match: (project, values) => values.includes(project.industry),
  },
  {
    key: "stackFilters",
    label: "Stack",
    options: [...STACK_FILTER_NAMES],
    match: (project, values) => values.every((value) => (project.stackFilters as readonly string[]).includes(value)),
  },
  {
    key: "company",
    label: "Company",
    options: ["Personal", "Avocado Technology", "Allsquare", "EngagePoint"],
    match: (project, values) => values.includes(project.company),
  },
]
