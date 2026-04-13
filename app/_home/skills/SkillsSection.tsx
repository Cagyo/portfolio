"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "../../../assets/icons/ChevronDownIcon";
import { BlobBackground } from "../../_components/BlobBackground";
import { EmptyState } from "../../_components/EmptyState";
import { SearchInput } from "../../_components/SearchInput";
import { SectionHeader } from "../../_components/SectionHeader";
import { SkillChip } from "./SkillChip";
import { SkillFilterTabs } from "./SkillFilterTabs";
import { CATEGORIES, SKILLS } from "./skills-data";
import styles from "./SkillsSection.module.css";

const INITIAL_REST = 10;

export function SkillsSection() {
  const t = useTranslations("skills");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return SKILLS.filter((skill) => {
      const matchCat = activeCat === 0 || skill.cat === activeCat;
      const matchText = skill.name.toLowerCase().includes(query);
      return matchCat && matchText;
    });
  }, [search, activeCat]);

  const topSkills = filtered.filter((skill) => skill.top);
  const restSkills = filtered.filter((skill) => !skill.top);

  const isFiltering = activeCat !== 0 || search.length > 0;
  const visibleRest = isFiltering || expanded ? restSkills : restSkills.slice(0, INITIAL_REST);
  const hiddenCount = restSkills.length - INITIAL_REST;
  const showToggle = !isFiltering && hiddenCount > 0;

  const counts = useMemo(() => {
    const categoryCounts: Record<number, number> = { [0]: SKILLS.length };
    SKILLS.forEach((skill) => {
      categoryCounts[skill.cat] = (categoryCounts[skill.cat] ?? 0) + 1;
    });
    return categoryCounts;
  }, []);

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="-bottom-20 -left-20" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="reveal mb-10 space-y-5">
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
                    <span className="text-amber-500/70 text-xs uppercase tracking-widest font-semibold">{t("coreExpertise")}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {topSkills.map((skill) => (
                      <SkillChip key={skill.name} name={skill.name} category={CATEGORIES.find((category) => category.id === skill.cat)?.label ?? ""} variant="top" />
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
                      <SkillChip key={skill.name} name={skill.name} category={CATEGORIES.find((category) => category.id === skill.cat)?.label ?? ""} variant="rest" />
                    ))}
                  </div>
                  {showToggle && (
                    <div className="mt-5">
                      <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className={`${styles.skillsToggleBtn} ${expanded ? styles.expanded : ""}`}
                        aria-expanded={expanded}
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
    </section>
  );
}
