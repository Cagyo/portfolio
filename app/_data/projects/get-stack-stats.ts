import { FILTER_GROUPS } from "@/app/_data/projects-filters"
import { PROJECT_BASES } from "./base"

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

export type StackSignature = {
  skills: string[]
  count: number
  projectIds: number[]
}

/**
 * Curated overrides for auto-generated bundle labels.
 * Key: stack skills sorted ascending and joined with "+".
 * Value: human-readable label.
 * Empty by default — labels are derived from the stack until curated.
 */
export const STACK_BUNDLE_OVERRIDES: Record<string, string> = {}

export function getStackBundleLabel(skills: string[]): string {
  const key = [...skills].sort().join("+")
  return STACK_BUNDLE_OVERRIDES[key] ?? skills.join(" + ")
}

export function getStackSignatures(): StackSignature[] {
  const buckets = new Map<string, StackSignature>()

  for (const project of PROJECT_BASES) {
    if (project.stackFilters.length === 0) continue
    const sortedSkills = [...project.stackFilters].sort()
    const key = sortedSkills.join("+")
    const existing = buckets.get(key)
    if (existing) {
      existing.count += 1
      existing.projectIds.push(project.id)
    } else {
      buckets.set(key, { skills: sortedSkills, count: 1, projectIds: [project.id] })
    }
  }

  return [...buckets.values()]
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.skills.length - a.skills.length
    })
    .slice(0, 3)
}
