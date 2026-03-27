"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "../../assets/icons/ChevronDownIcon";
import { BlobBackground } from "../_components/BlobBackground";
import { EmptyState } from "../_components/EmptyState";
import { SearchInput } from "../_components/SearchInput";
import { SectionHeader } from "../_components/SectionHeader";
import { SkillChip } from "./SkillChip";
import { SkillFilterTabs } from "./SkillFilterTabs";
import { SKILLS } from "./skills-data";

const INITIAL_REST = 10;

export function SkillsSection() {
  const t = useTranslations("skills");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SKILLS.filter((s) => {
      const matchCat = activeCat === "all" || s.cat.toLowerCase() === activeCat;
      const matchText = s.name.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [search, activeCat]);

  const topSkills = filtered.filter((s) => s.top);
  const restSkills = filtered.filter((s) => !s.top);

  const isFiltering = activeCat !== "all" || search.length > 0;
  const visibleRest = isFiltering || expanded ? restSkills : restSkills.slice(0, INITIAL_REST);
  const hiddenCount = restSkills.length - INITIAL_REST;
  const showToggle = !isFiltering && hiddenCount > 0;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: SKILLS.length };
    SKILLS.forEach((s) => {
      const key = s.cat.toLowerCase();
      c[key] = (c[key] ?? 0) + 1;
    });
    return c;
  }, []);

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="-bottom-20 -left-20" opacity="0.1" />

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
            <EmptyState query={search} onClear={() => { setSearch(""); setActiveCat("all"); }} />
          ) : (
            <>
              {topSkills.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-amber-500/70 text-xs uppercase tracking-widest font-semibold">{t("coreExpertise")}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {topSkills.map((s) => (
                      <SkillChip key={s.name} name={s.name} category={s.cat} variant="top" />
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
                    {visibleRest.map((s) => (
                      <SkillChip key={s.name} name={s.name} category={s.cat} variant="rest" />
                    ))}
                  </div>
                  {showToggle && (
                    <div className="mt-5">
                      <button
                        onClick={() => setExpanded((e) => !e)}
                        className={`skills-toggle-btn ${expanded ? "expanded" : ""}`}
                        aria-expanded={expanded}
                      >
                        <ChevronDownIcon className="toggle-chevron w-3.5 h-3.5" />
                        <span>{expanded ? t("showLess") : t("showMore")}</span>
                        <span className="toggle-count">+{hiddenCount}</span>
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
