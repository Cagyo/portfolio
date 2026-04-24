import { FILTER_GROUPS } from "@/app/_data/projects-filters"
import type { StackFilterName } from "@/app/_data/skills-data"
import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"
import { getStackName, type ProjectBase } from "./types"

const stackFilterGroup = FILTER_GROUPS.find((filterGroup) => filterGroup.key === "stackFilters")

export const STACK_FILTER_OPTIONS: readonly string[] = stackFilterGroup?.options ?? []

const STACK_FILTER_OPTION_SET = new Set<string>(STACK_FILTER_OPTIONS)

export function isFilterableStack(name: string): boolean {
  return STACK_FILTER_OPTION_SET.has(name)
}

const PROJECT_COUNT_BY_STACK: Record<string, number> = (() => {
  const counts: Record<string, number> = {}
  for (const stack of STACK_FILTER_OPTIONS) counts[stack] = 0
  for (const project of PROJECT_BASES) {
    for (const stack of project.stackFilters) {
      if (STACK_FILTER_OPTION_SET.has(stack)) {
        counts[stack] = (counts[stack] ?? 0) + 1
      }
    }
  }
  return counts
})()

export function getProjectCountByStack(skill: string): number {
  return PROJECT_COUNT_BY_STACK[skill] ?? 0
}

export type OutcomeBucketKey = "full-stack" | "mobile" | "payments"

export type OutcomeBucket = {
  key: OutcomeBucketKey
  href: string
  topStacks: StackFilterName[]
  count: number
  projectIds: number[]
}

type BucketDef = {
  key: OutcomeBucketKey
  href: string
  matches: (project: ProjectBase) => boolean
}

const PAYMENT_STACK_NAMES = new Set<string>(["Stripe", "Saferpay"])

const OUTCOME_BUCKET_DEFS: BucketDef[] = [
  {
    key: "full-stack",
    href: "/projects?devTypes=Full+Stack",
    matches: (project) => PROJECT_CONTENT_EN[project.id]?.devTypes.includes("Full Stack") ?? false,
  },
  {
    key: "mobile",
    href: "/projects?devTypes=Mobile",
    matches: (project) => PROJECT_CONTENT_EN[project.id]?.devTypes.includes("Mobile") ?? false,
  },
  {
    key: "payments",
    href: "/projects?stackFilters=Stripe",
    matches: (project) => project.stack.some((entry) => PAYMENT_STACK_NAMES.has(getStackName(entry))),
  },
]

export function getOutcomeBuckets(): OutcomeBucket[] {
  return OUTCOME_BUCKET_DEFS.map(({ key, href, matches }) => {
    const projectIds: number[] = []
    const stackCounts = new Map<StackFilterName, number>()

    for (const project of PROJECT_BASES) {
      if (!matches(project)) continue

      projectIds.push(project.id)
      for (const stack of project.stackFilters) {
        stackCounts.set(stack, (stackCounts.get(stack) ?? 0) + 1)
      }
    }

    const topStacks = [...stackCounts.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        return STACK_FILTER_OPTIONS.indexOf(a[0]) - STACK_FILTER_OPTIONS.indexOf(b[0])
      })
      .slice(0, 4)
      .map(([stack]) => stack)

    return { key, href, topStacks, count: projectIds.length, projectIds }
  })
}
