import { FILTER_GROUPS } from "@/app/_data/projects-filters"
import type { StackFilterName } from "@/app/_data/skills-data"
import { PROJECT_BASES } from "./base"
import { PROJECT_CONTENT_EN } from "./content.en"

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

export type OutcomeBucketKey = "full-stack" | "mobile"
export type OutcomeBucketDevType = "Full Stack" | "Mobile"

export type OutcomeBucket = {
  key: OutcomeBucketKey
  devType: OutcomeBucketDevType
  topStacks: StackFilterName[]
  count: number
  projectIds: number[]
}

const OUTCOME_BUCKET_DEFS: { key: OutcomeBucketKey; devType: OutcomeBucketDevType }[] = [
  { key: "full-stack", devType: "Full Stack" },
  { key: "mobile", devType: "Mobile" },
]

export function getOutcomeBuckets(): OutcomeBucket[] {
  return OUTCOME_BUCKET_DEFS.map(({ key, devType }) => {
    const projectIds: number[] = []
    const stackCounts = new Map<StackFilterName, number>()

    for (const project of PROJECT_BASES) {
      const content = PROJECT_CONTENT_EN[project.id]
      if (!content || !content.devTypes.includes(devType)) continue

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

    return { key, devType, topStacks, count: projectIds.length, projectIds }
  })
}
