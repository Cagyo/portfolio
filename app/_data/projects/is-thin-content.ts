import type { Project } from "./types";

const THIN_CONTENT_THRESHOLD_WORDS = 120;

function combinedProse(project: Project): string {
  return [
    project.description,
    project.problem ?? "",
    project.approach ?? "",
    ...project.achievements,
    ...project.duties,
    project.skills,
    project.teamDetail,
  ].join(" ");
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function isThinContent(project: Project): boolean {
  return wordCount(combinedProse(project)) < THIN_CONTENT_THRESHOLD_WORDS;
}
