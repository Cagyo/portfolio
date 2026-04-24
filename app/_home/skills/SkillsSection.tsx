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
  const [showBuried, setShowBuried] = useState(false);

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
  const hiddenRestCount = restSkills.length - INITIAL_REST;
  const showRestToggle = !isFiltering && hiddenRestCount > 0;
  const showBuriedToggle = !isFiltering && expanded && buriedSkills.length > 0;
  const visibleBuried = isFiltering ? buriedSkills : showBuried ? buriedSkills : [];

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
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="-bottom-20 -left-20" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <ShippableStacks />

        <div className="reveal mb-10 space-y-5 border-t border-white/5 pt-8">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t("searchPlaceholder")}
            label={t("searchLabel")}
          />
          <SkillFilterTabs active={activeCat} counts={counts} onSelect={setActiveCat} />
        </div>

        <p className="text-white/30 text-xs mb-6 reveal" aria-live="polite">
          {t("counter", { filtered: filtered.length, total: SKILLS.length })}
        </p>

        <div className="reveal">
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

              {restSkills.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-white/25 text-xs uppercase tracking-widest">{t("additionalSkills")}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-2 pb-2">
                    {visibleRest.map((skill) => (
                      <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                    ))}
                  </div>
                  {showRestToggle && (
                    <div className="mt-5">
                      <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className={`${styles.skillsToggleBtn} ${expanded ? styles.expanded : ""}`}
                        aria-expanded={expanded}
                      >
                        <ChevronDownIcon className={`${styles.toggleChevron} w-3.5 h-3.5`} />
                        <span>{expanded ? t("showLess") : t("showMore")}</span>
                        <span className={styles.toggleCount}>+{hiddenRestCount}</span>
                      </button>
                    </div>
                  )}
                </>
              )}

              {visibleBuried.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2 mt-4">
                  {visibleBuried.map((skill) => (
                    <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                  ))}
                </div>
              )}

              {showBuriedToggle && (
                <div className="mt-5">
                  <button
                    onClick={() => setShowBuried((prev) => !prev)}
                    className={`${styles.skillsToggleBtn} ${showBuried ? styles.expanded : ""}`}
                    aria-expanded={showBuried}
                  >
                    <ChevronDownIcon className={`${styles.toggleChevron} w-3.5 h-3.5`} />
                    <span>{showBuried ? t("showFewer") : t("showAll")}</span>
                    <span className={styles.toggleCount}>+{buriedSkills.length}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
