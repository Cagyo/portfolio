"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { EmptyState } from "../../_components/EmptyState";
import { SearchInput } from "../../_components/SearchInput";
import { ActiveChips } from "./filter/ActiveChips";
import { FilterPanelMobile } from "./filter/FilterPanelMobile";
import { FilterSidebar } from "./filter/FilterSidebar";
import { ProjectCard } from "./project-card/ProjectCard";
import { ProjectsNav } from "./ProjectsNav";
import { PROJECTS, getProjectTitle } from "../../_data/projects-data";
import type { ProjectData } from "../../_data/projects-data";
import { FILTER_GROUPS } from "../../_data/projects-filters";

function matchesSearch(project: ProjectData, query: string): boolean {
  const haystack = [
    getProjectTitle(project),
    project.description,
    project.company,
    project.industry,
    ...project.stack,
    ...project.duties,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function ProjectsPage() {
  const t = useTranslations("projectsPage");
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    FILTER_GROUPS.forEach((filterGroup) => {
      const param = searchParams.get(filterGroup.key);
      init[filterGroup.key] = param ? new Set([param]) : new Set();
    });
    return init;
  });
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reset drawer on route cache unmount (per CLAUDE.md Activity guidance)
  useLayoutEffect(() => {
    return () => setMobileOpen(false);
  }, []);

  // Scroll to hashed project card on load and re-activation; support same-page hash re-navigation
  useEffect(() => {
    let activeTimer: ReturnType<typeof setTimeout> | undefined;

    function scrollToHash() {
      const hash = window.location.hash;
      if (!hash) return;
      const el = document.querySelector(hash) as HTMLElement | null;
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // Reset before re-applying so the animation always replays
      delete el.dataset.highlighted;
      void el.offsetHeight; // force reflow
      el.dataset.highlighted = "true";

      clearTimeout(activeTimer);
      activeTimer = setTimeout(() => {
        delete el.dataset.highlighted;
      }, 2500);
    }

    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      clearTimeout(activeTimer);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return PROJECTS.filter((project) => {
      if (search && !matchesSearch(project, query)) return false;
      for (const filterGroup of FILTER_GROUPS) {
        const active = activeFilters[filterGroup.key];
        if (active.size === 0) continue;
        if (!filterGroup.match(project, [...active])) return false;
      }
      return true;
    });
  }, [search, activeFilters]);

  const totalActive = useMemo(
    () => Object.values(activeFilters).reduce((acc, filterSet) => acc + filterSet.size, 0),
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
      FILTER_GROUPS.forEach((filterGroup) => { init[filterGroup.key] = new Set(); });
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
              <EmptyState
                message={t("noResultsTitle")}
                hint={t("noResultsHint")}
                clearLabel={t("clearAllFilters")}
                onClear={clearAll}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
