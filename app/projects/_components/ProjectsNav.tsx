"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";

type ProjectsNavProps = {
  count: number
  onFilterOpen: () => void
}

export function ProjectsNav({ count, onFilterOpen }: ProjectsNavProps) {
  const t = useTranslations("projectsPage");

  return (
    <nav className="fixed top-4 left-4 right-4 z-30">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-black text-lg tracking-tight cursor-pointer flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          aria-label={t("backToHome")}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-heading font-black text-xs flex-shrink-0">
            <span>OB</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={onFilterOpen}
            className="lg:hidden glass px-3 py-2 rounded-xl text-sm text-white/60 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2"
            aria-label={t("filters")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {t("filters")}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-white/30 text-sm">
            <span className="font-heading font-bold text-white">{count}</span>
            <span>{count === 1 ? "project" : "projects"}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
