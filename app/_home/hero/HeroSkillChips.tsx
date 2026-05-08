import { Tag } from "@/app/_components/tag/Tag";
import { TOP_SKILL_NAMES } from "./top-skills";
import { getTranslations } from "next-intl/server";

export async function HeroSkillChips() {
  const t = await getTranslations("hero");

  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Core stack">
      <Tag variant="amber">AI</Tag>
      {TOP_SKILL_NAMES.map((name) => (
        <Tag key={name}>{name}</Tag>
      ))}
      <Tag variant="amber">{t("systemDesignSkill")}</Tag>
    </div>
  );
}