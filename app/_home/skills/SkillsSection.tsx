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
import styles from "./SkillsSection.module.css";

const INITIAL_REST = 10;
const AI_CATEGORY_ID = 9;

type SkillsSectionProps = { sectionNumber?: string }

export function SkillsSection({ sectionNumber }: SkillsSectionProps) {
  const t = useTranslations("skills");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsPanelId = "skills-full-stack-panel";

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return SKILLS.filter((skill) => {
      const matchCat = activeCat === 0 || skill.cat === activeCat;
      const matchText = skill.name.toLowerCase().includes(query);
      return matchCat && matchText;
    });
  }, [search, activeCat]);

  const isFiltering = activeCat !== 0 || search.length > 0;

  const topSkills = filtered.filter((skill) => "top" in skill && skill.top);
  const aiSkills = filtered.filter((skill) => skill.cat === AI_CATEGORY_ID && !("top" in skill && skill.top));
  const nonTopNonAi = filtered.filter(
    (skill) => !("top" in skill && skill.top) && skill.cat !== AI_CATEGORY_ID,
  );
  const restSkills = nonTopNonAi.filter((skill) => !("buried" in skill && skill.buried));
  const buriedSkills = nonTopNonAi.filter((skill) => "buried" in skill && skill.buried);

  const visibleRest = isFiltering || expanded ? restSkills : restSkills.slice(0, INITIAL_REST);
  const visibleBuried = isFiltering || expanded ? buriedSkills : [];
  const hiddenCount = Math.max(0, restSkills.length - INITIAL_REST) + buriedSkills.length;
  const showToggle = !isFiltering && hiddenCount > 0;
  const showBuriedHeader = expanded && !isFiltering && buriedSkills.length > 0;

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
            className="w-full flex items-center gap-3 text-white/25 hover:text-white/50 transition-colors duration-200 cursor-pointer group py-1"
          >
            <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
            <span className="text-xs tracking-wide">
              {detailsOpen ? t("fullStackToggleHide") : t("fullStackToggleShow")}
            </span>
            <ChevronDownIcon
              className={`w-3 h-3 transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`}
            />
            <div className="flex-1 border-t border-dashed border-white/10 group-hover:border-white/20 transition-colors duration-200" />
          </button>
        </div>

        <div
          id={detailsPanelId}
          className={styles.detailsGrid}
          style={{ gridTemplateRows: detailsOpen ? "1fr" : "0fr" }}
        >
          <div className={styles.detailsInner}>
            <div className="mb-10 space-y-5 pt-8">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t("searchPlaceholder")}
                label={t("searchLabel")}
              />
              <SkillFilterTabs active={activeCat} counts={counts} onSelect={setActiveCat} />
            </div>

            <p className="text-white/30 text-xs mb-6" aria-live="polite">
              {t("counter", { filtered: filtered.length, total: SKILLS.length })}
            </p>

            <div>
              {filtered.length === 0 ? (
            <EmptyState
              message={t("noResults", { query: search })}
              clearLabel={t("clearSearch")}
              onClear={() => { setSearch(""); setActiveCat(0); }}
            />
          ) : (
            <>
              {topSkills.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white/35 text-xs uppercase tracking-widest font-medium">{t("coreExpertise")}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
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
                </>
              )}

              {aiSkills.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white/35 text-xs uppercase tracking-widest font-medium">{t("aiToolingLabel")}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
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
                </>
              )}

              {(restSkills.length > 0 || buriedSkills.length > 0) && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white/25 text-xs uppercase tracking-widest">{t("additionalSkills")}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div id="skills-additional" className="flex flex-wrap gap-2 pb-2">
                    {visibleRest.map((skill) => (
                      <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                    ))}
                    {isFiltering && visibleBuried.map((skill) => (
                      <SkillChip key={`buried-${skill.name}`} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                    ))}
                  </div>

                  {showBuriedHeader && (
                    <>
                      <div className="flex items-center gap-3 mb-4 mt-6">
                        <span className="text-white/25 text-xs uppercase tracking-widest">{t("moreToolsLabel")}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div id="skills-more-tools" className="flex flex-wrap gap-2 pb-2">
                        {visibleBuried.map((skill) => (
                          <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                        ))}
                      </div>
                    </>
                  )}

                  {showToggle && (
                    <div className="mt-5">
                      <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className={`${styles.skillsToggleBtn} ${expanded ? styles.expanded : ""}`}
                        aria-expanded={expanded}
                        aria-controls={showBuriedHeader ? "skills-additional skills-more-tools" : "skills-additional"}
                      >
                        <ChevronDownIcon className={`${styles.toggleChevron} w-3.5 h-3.5`} />
                        <span>{expanded ? t("showLess") : t("showMore")}</span>
                        <span className={styles.toggleCount}>+{hiddenCount}</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
