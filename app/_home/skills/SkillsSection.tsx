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

const AI_CATEGORY_ID = 9;

type SkillsSectionProps = { sectionNumber?: string }

type SkillGroupProps = {
  children: React.ReactNode
  label: string
  tone?: "strong" | "muted"
}

function SkillGroup({ children, label, tone = "muted" }: SkillGroupProps) {
  return (
    <div className={styles.skillGroup}>
      <div className={styles.skillGroupHeader}>
        <span className={tone === "strong" ? styles.skillGroupTitleStrong : styles.skillGroupTitle}>{label}</span>
        <div className={styles.skillGroupRule} />
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
            className={`${styles.drawerTrigger} ${detailsOpen ? styles.drawerTriggerOpen : ""}`}
          >
            <span className={styles.drawerTriggerLabel}>
              {detailsOpen ? t("fullStackToggleHide") : t("fullStackToggleShow")}
            </span>
            <ChevronDownIcon
              className={styles.drawerChevron}
              aria-hidden
            />
          </button>
        </div>

        <div
          id={detailsPanelId}
          className={`${styles.detailsGrid} ${detailsOpen ? styles.detailsGridOpen : ""}`}
          aria-hidden={!detailsOpen}
          inert={!detailsOpen}
        >
          <div className={styles.detailsInner}>
            <div className={styles.detailsDrawer}>
              <div className={styles.detailsToolbar}>
                <div className={styles.detailsSearchStack}>
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("searchPlaceholder")}
                    label={t("searchLabel")}
                    className={styles.searchInput}
                  />
                  <p className={styles.counterLine} aria-live="polite">
                    {t("counter", { filtered: filtered.length, total: SKILLS.length })}
                  </p>
                </div>
                <SkillFilterTabs active={activeCategory} counts={counts} onSelect={setActiveCategory} />
              </div>

              <div className={styles.detailsResults}>
                {filtered.length === 0 ? (
                  <EmptyState
                    message={t("noResults", { query: search })}
                    clearLabel={t("clearSearch")}
                    onClear={() => { setSearch(""); setActiveCategory(0); }}
                  />
                ) : (
                  <div className={styles.inventoryGrid}>
                    {topSkills.length > 0 && (
                      <SkillGroup label={t("coreExpertise")} tone="strong">
                        <div className={styles.featuredChipGroup}>
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
                        <div className={styles.featuredChipGroup}>
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
                        <div id="skills-additional" className={styles.denseChipGroup}>
                          {restSkills.map((skill) => (
                            <SkillChip key={skill.name} name={skill.name} category={categoryLabelFor(skill.cat)} variant="rest" />
                          ))}
                        </div>
                      </SkillGroup>
                    )}

                    {showBuriedHeader && (
                      <SkillGroup label={t("moreToolsLabel")}>
                        <div id="skills-more-tools" className={styles.denseChipGroup}>
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
