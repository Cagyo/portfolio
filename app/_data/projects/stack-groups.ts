import {
  CATEGORIES,
  SKILLS,
  STACK_FILTER_NAMES,
  type Skill,
} from "@/app/_data/skills-data";
import { getStackName, type StackEntry } from "./types";

export type ProjectStackGroupEntry = {
  name: string;
};

export type ProjectStackGroup = {
  category: string;
  entries: ProjectStackGroupEntry[];
};

export type ProjectStackGroups = {
  primaryGroups: ProjectStackGroup[];
  secondaryGroups: ProjectStackGroup[];
};

const skillByName: ReadonlyMap<string, Skill> = new Map(
  SKILLS.map((skill) => [skill.name, skill]),
);
const categoryById: ReadonlyMap<number, string> = new Map(
  CATEGORIES.map((category) => [category.id, category.label]),
);
const stackFilterNameSet: ReadonlySet<string> = new Set(STACK_FILTER_NAMES);
const TOOLS_CATEGORY_ID = CATEGORIES.find((cat) => cat.label === "Tools")?.id;
const fallbackCategory =
  TOOLS_CATEGORY_ID !== undefined
    ? (categoryById.get(TOOLS_CATEGORY_ID) ?? "Tools")
    : "Tools";

export function getProjectStackGroups(
  stack: readonly StackEntry[],
): ProjectStackGroups {
  const groupedEntries = stack.reduce(
    (groups, stackEntry) => {
      const name = getStackName(stackEntry);
      const skill = skillByName.get(name);
      const category = getCategoryLabel(skill);
      const targetGroups = isPrimaryStackEntry(skill)
        ? groups.primaryGroups
        : groups.secondaryGroups;

      appendToGroup(targetGroups, category, name);
      return groups;
    },
    {
      primaryGroups: new Map<string, ProjectStackGroupEntry[]>(),
      secondaryGroups: new Map<string, ProjectStackGroupEntry[]>(),
    },
  );

  if (groupedEntries.primaryGroups.size === 0) {
    return promoteFirstSecondaryGroup(groupedEntries.secondaryGroups);
  }

  return {
    primaryGroups: orderGroups(groupedEntries.primaryGroups),
    secondaryGroups: orderGroups(groupedEntries.secondaryGroups),
  };
}

function isPrimaryStackEntry(skill: Skill | undefined): boolean {
  if (!skill || skill.buried) return false;
  return Boolean(skill.top || stackFilterNameSet.has(skill.name));
}

function getCategoryLabel(skill: Skill | undefined): string {
  if (!skill) return fallbackCategory;
  return categoryById.get(skill.cat) ?? fallbackCategory;
}

function appendToGroup(
  groups: Map<string, ProjectStackGroupEntry[]>,
  category: string,
  name: string,
) {
  const entries = groups.get(category) ?? [];
  entries.push({ name });
  groups.set(category, entries);
}

function promoteFirstSecondaryGroup(
  secondaryGroups: Map<string, ProjectStackGroupEntry[]>,
): ProjectStackGroups {
  const orderedGroups = orderGroups(secondaryGroups);
  const [firstGroup, ...remainingGroups] = orderedGroups;

  return {
    primaryGroups: firstGroup ? [firstGroup] : [],
    secondaryGroups: remainingGroups,
  };
}

function orderGroups(
  groups: Map<string, ProjectStackGroupEntry[]>,
): ProjectStackGroup[] {
  return CATEGORIES.filter((category) => category.id !== 0)
    .map((category) => ({
      category: category.label,
      entries: groups.get(category.label) ?? [],
    }))
    .filter((group) => group.entries.length > 0);
}
