"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { EmptyState } from "@/app/_components/EmptyState";
import { SearchInput } from "@/app/_components/SearchInput";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { SkillChip } from "./SkillChip";
import { SkillFilterTabs } from "./SkillFilterTabs";
import { ShippableStacks } from "./ShippableStacks";
import { CATEGORIES, SKILLS } from "@/app/_data/skills-data";
import { getProjectCountByStack } from "@/app/_data/projects/get-stack-stats";

const AI_CATEGORY_ID = 9;

type SkillsSectionProps = { sectionNumber?: string }

type SkillGroupProps = {
  children: React.ReactNode
  label: string
  tone?: "strong" | "muted"
}

function SkillGroup({ children, label, tone = "muted" }: SkillGroupProps) {
  return (
    <div className="grid gap-[10px]">
      <div className="flex items-center gap-[10px]">
        <span
          className={
            tone === "strong"
              ? "text-[0.68rem] leading-none tracking-[0.13em] uppercase whitespace-nowrap text-muted-foreground font-bold"
              : "text-[0.68rem] leading-none tracking-[0.13em] uppercase whitespace-nowrap text-faint-foreground font-semibold"
          }
        >
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--input-border)]" />
      </div>
      {children}
    </div>
  );
}

export function SkillsSection({ sectionNumber }: SkillsSectionProps) {
  const t = useTranslations("skills");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsPanelId = "skills-full-stack-panel";

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return SKILLS.filter((skill) => {
      const matchCategory = activeCategory === 0 || skill.cat === activeCategory;
      const matchText = skill.name.toLowerCase().includes(query);
      return matchCategory && matchText;
    });
  }, [search, activeCategory]);

  const topSkills = filtered.filter((skill) => "top" in skill && skill.top);
  const aiSkills = filtered.filter((skill) => skill.cat === AI_CATEGORY_ID && !("top" in skill && skill.top));
  const nonTopNonAi = filtered.filter(
    (skill) => !("top" in skill && skill.top) && skill.cat !== AI_CATEGORY_ID,
  );
  const restSkills = nonTopNonAi.filter((skill) => !("buried" in skill && skill.buried));
  const buriedSkills = nonTopNonAi.filter((skill) => "buried" in skill && skill.buried);
  const showBuriedHeader = buriedSkills.length > 0;

  const counts = useMemo(() => {
    const categoryCounts: Record<number, number> = { [0]: SKILLS.length };
    SKILLS.forEach((skill) => {
      categoryCounts[skill.cat] = (categoryCounts[skill.cat] ?? 0) + 1;
    });
    return categoryCounts;
  }, []);

  const categoryLabelFor = (catId: number) =>
    CATEGORIES.find((category) => category.id === catId)?.label ?? "";

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <BlobBackground size="md" position="-bottom-20 -left-20" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <ShippableStacks />

        <div className="reveal mt-8">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            aria-expanded={detailsOpen}
            aria-controls={detailsPanelId}
            className="group w-full grid [grid-template-columns:minmax(24px,1fr)_auto_auto_minmax(24px,1fr)] items-center gap-3 py-1 border-0 bg-transparent text-faint-foreground cursor-pointer text-[0.75rem] tracking-[0.03em] transition-colors duration-200 ease hover:text-[color:var(--tag-color)] focus-visible:text-[color:var(--tag-color)] focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-4 before:content-[''] before:h-px before:border-t before:border-dashed before:border-[var(--input-border)] before:transition-[border-color] before:duration-200 before:ease after:content-[''] after:h-px after:border-t after:border-dashed after:border-[var(--input-border)] after:transition-[border-color] after:duration-200 after:ease hover:before:border-[color-mix(in_srgb,var(--amber)_30%,transparent)] hover:after:border-[color-mix(in_srgb,var(--amber)_30%,transparent)] focus-visible:before:border-[color-mix(in_srgb,var(--amber)_30%,transparent)] focus-visible:after:border-[color-mix(in_srgb,var(--amber)_30%,transparent)] motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:transition-none"
          >
            <span className="whitespace-nowrap">
              {detailsOpen ? t("fullStackToggleHide") : t("fullStackToggleShow")}
            </span>
            <ChevronDownIcon
              className="size-3 transition-transform duration-300 ease group-aria-expanded:rotate-180 motion-reduce:transition-none"
              aria-hidden
            />
          </button>
        </div>

        <div
          id={detailsPanelId}
          data-open={detailsOpen ? "true" : undefined}
          className="grid [grid-template-rows:0fr] data-[open=true]:[grid-template-rows:1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          aria-hidden={!detailsOpen}
          inert={!detailsOpen}
        >
          <div className="overflow-hidden">
            <div className="mt-[18px] border-y border-[var(--input-border)] [background:var(--skills-drawer-bg)]">
              <div className="grid [grid-template-columns:minmax(230px,320px)_minmax(0,1fr)] max-md:grid-cols-1 gap-4 items-start pt-4 pb-[18px] px-4 sm:px-6 lg:px-8 border-b border-[var(--input-border)]">
                <div className="grid gap-2">
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("searchPlaceholder")}
                    label={t("searchLabel")}
                    clearLabel={t("clearSearch")}
                    className="max-w-none"
                  />
                  <p className="text-faint-foreground text-[0.72rem] leading-[1.4]" aria-live="polite">
                    {t("counter", { filtered: filtered.length, total: SKILLS.length })}
                  </p>
                </div>
                <SkillFilterTabs active={activeCategory} counts={counts} onSelect={setActiveCategory} />
              </div>

              <div className="pt-[18px] pb-5 px-4 sm:px-6 lg:px-8">
                {filtered.length === 0 ? (
                  <EmptyState
                    message={t("noResults", { query: search })}
                    clearLabel={t("clearSearch")}
                    onClear={() => { setSearch(""); setActiveCategory(0); }}
                  />
                ) : (
                  <div className="grid gap-[18px]">
                    {topSkills.length > 0 && (
                      <SkillGroup label={t("coreExpertise")} tone="strong">
                        <div className="flex flex-wrap gap-2">
                          {topSkills.map((skill) => (
                            <SkillChip
                              key={skill.name}
                              name={skill.name}
                              category={categoryLabelFor(skill.cat)}
                              variant="top"
                              projectCount={getProjectCountByStack(skill.name)}
                            />
                          ))}
                        </div>
                      </SkillGroup>
                    )}

                    {aiSkills.length > 0 && (
                      <SkillGroup label={t("aiToolingLabel")} tone="strong">
                        <div className="flex flex-wrap gap-2">
                          {aiSkills.map((skill) => (
                            <SkillChip
                              key={skill.name}
                              name={skill.name}
                              category={categoryLabelFor(skill.cat)}
                              variant="top"
                              projectCount={getProjectCountByStack(skill.name)}
                            />
                          ))}
                        </div>
                      </SkillGroup>
                    )}

                    {restSkills.length > 0 && (
                      <SkillGroup label={t("additionalSkills")}>
                        <div id="skills-additional" className="flex flex-wrap gap-1.5">
                          {restSkills.map((skill) => (
                            <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                          ))}
                        </div>
                      </SkillGroup>
                    )}

                    {showBuriedHeader && (
                      <SkillGroup label={t("moreToolsLabel")}>
                        <div id="skills-more-tools" className="flex flex-wrap gap-1.5">
                          {buriedSkills.map((skill) => (
                            <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                          ))}
                        </div>
                      </SkillGroup>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
