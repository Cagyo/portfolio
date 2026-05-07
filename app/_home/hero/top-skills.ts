import { SKILLS } from "@/app/_data/skills-data";

export const TOP_SKILL_NAMES = SKILLS
  .filter((skill) => "top" in skill && skill.top)
  .map((skill) => skill.name);