"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchInput } from "../_components/SearchInput";
import { ActiveChips } from "./ActiveChips";
import { FilterPanelMobile } from "./FilterPanelMobile";
import { FilterSidebar } from "./FilterSidebar";
import { ProjectCard } from "./ProjectCard";
import { ProjectsNav } from "./ProjectsNav";
import { FILTER_GROUPS, PROJECTS } from "./projects-data";

export function ProjectsPage() {
  const t = useTranslations("projectsPage");

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    FILTER_GROUPS.forEach((g) => { init[g.key] = new Set(); });
    return init;
  });
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reset drawer on route cache unmount (per CLAUDE.md Activity guidance)
  useLayoutEffect(() => {
    return () => setMobileOpen(false);
  }, []);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const haystack = [p.title, p.description, p.company, p.industry, ...p.stack, ...p.duties]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      for (const g of FILTER_GROUPS) {
        const active = activeFilters[g.key];
        if (active.size === 0) continue;
        if (!g.match(p, [...active])) return false;
      }
      return true;
    });
  }, [search, activeFilters]);

  const totalActive = useMemo(
    () => Object.values(activeFilters).reduce((acc, s) => acc + s.size, 0),
    [activeFilters],
  );

  function toggleFilter(groupKey: string, value: string) {
    setActiveFilters((prev) => {
      const next = { ...prev, [groupKey]: new Set(prev[groupKey]) };
      if (next[groupKey].has(value)) {
        next[groupKey].delete(value);
      } else {
        next[groupKey].add(value);
      }
      return next;
    });
  }

  function clearAll() {
    setActiveFilters(() => {
      const init: Record<string, Set<string>> = {};
      FILTER_GROUPS.forEach((g) => { init[g.key] = new Set(); });
      return init;
    });
    setSearch("");
  }

  function toggleExpand(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const resultLabel = filtered.length === 1
    ? t("showingOne")
    : t("showingMany", { count: filtered.length });

  return (
    <>
      <ProjectsNav count={filtered.length} onFilterOpen={() => setMobileOpen(true)} />

      <FilterPanelMobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        groups={FILTER_GROUPS}
        activeFilters={activeFilters}
        onToggle={toggleFilter}
        onClear={clearAll}
        totalActive={totalActive}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="font-heading font-black text-4xl sm:text-5xl text-white">{t("title")}</h1>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 to-transparent" />
          </div>
          <p className="text-white/40 max-w-xl">{t("subtitle")}</p>
        </div>

        <div className="flex gap-8 items-start">
          <FilterSidebar
            groups={FILTER_GROUPS}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onClear={clearAll}
            totalActive={totalActive}
          />

          <div className="flex-1 min-w-0">
            {/* Search + active chips */}
            <div className="mb-6 space-y-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t("searchPlaceholder")}
                label={t("searchLabel")}
                className="w-full"
              />
              <ActiveChips
                activeFilters={activeFilters}
                groups={FILTER_GROUPS}
                onRemove={toggleFilter}
              />
            </div>

            {/* Result count */}
            <p className="text-white/35 text-sm mb-5" aria-live="polite">
              {resultLabel}
            </p>

            {/* Project cards */}
            {filtered.length > 0 ? (
              <div className="space-y-5">
                {filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    expanded={expandedIds.has(project.id)}
                    onToggleExpand={toggleExpand}
                    animationDelay={i * 0.06}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/30 text-base mb-1">{t("noResultsTitle")}</p>
                <p className="text-white/20 text-sm">{t("noResultsHint")}</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 text-amber-500 text-sm hover:text-amber-400 cursor-pointer underline underline-offset-2"
                >
                  {t("clearAllFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
