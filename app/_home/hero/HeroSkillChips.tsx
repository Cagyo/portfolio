import { Tag } from "@/app/_components/tag/Tag";
import { TOP_SKILL_NAMES } from "./top-skills";

export function HeroSkillChips() {
  return (
    <div className="flex flex-wrap gap-1.5 lg:hidden" aria-label="Core stack">
      <Tag variant="amber">AI</Tag>
      {TOP_SKILL_NAMES.map((name) => (
        <Tag key={name}>{name}</Tag>
      ))}
    </div>
  );
}