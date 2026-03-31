"use client";

import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "../../../../assets/icons/ChevronDownIcon";
import { ExternalLinkIcon } from "../../../../assets/icons/ExternalLinkIcon";
import { LockIcon } from "../../../../assets/icons/LockIcon";
import { LightningIcon } from "../../../../assets/icons/LightningIcon";
import { AppStoreLogo } from "../../../../assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "../../../../assets/logos/GooglePlayLogo";
import { Tag } from "../../../_components/tag/Tag";
import type { ProjectData, ProjectPageLink } from "../projects-data";
import { getProjectTitle } from "../../../_data/projects-data";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: ProjectData
  expanded: boolean
  onToggleExpand: (id: number) => void
  animationDelay?: number
}

export function ProjectCard({ project, expanded, onToggleExpand, animationDelay = 0 }: ProjectCardProps) {
  const t = useTranslations("projectsPage");

  return (
    <article
      className={`${styles.card} ${styles.cardEntrance} glass rounded-2xl overflow-hidden`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Card header */}
      <div className="p-6 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {project.devTypes.map((devType) => (
                <Tag key={devType}>{devType}</Tag>
              ))}
              <span className="bg-white/5 border border-white/10 text-white/50 text-[0.65rem] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded">
                {project.productType}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/50 text-[0.65rem] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded">
                {project.industry}
              </span>
              {project.year && (
                <span className="text-white/25 text-xs font-mono">{project.year}</span>
              )}
            </div>
            <h2 className="font-heading font-black text-xl text-white leading-tight">{getProjectTitle(project)}</h2>
          </div>

          {/* Meta column */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-white/60 text-sm font-medium">{project.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-white/60 text-sm">{project.role}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/60 text-sm">Team {project.teamLabel}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/55 text-sm leading-relaxed">{project.description}</p>

        {/* Achievements */}
        {project.achievements.length > 0 && (
          <div className="mt-4 glass-amber rounded-xl p-3.5">
            <p className="text-amber-500/70 text-xs uppercase tracking-widest font-bold mb-2">
              {t("achievements")}
            </p>
            <ul className="space-y-1">
              {project.achievements.map((achievement) => (
                <li key={achievement} className="flex items-start gap-2 text-sm text-white/80">
                  <LightningIcon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => onToggleExpand(project.id)}
          className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-semibold hover:text-amber-400 transition-colors cursor-pointer"
          aria-expanded={expanded}
        >
          <ChevronDownIcon
            className={`${styles.expandIcon} ${expanded ? styles.expandIconOpen : ""} w-4 h-4`}
          />
          {expanded ? t("hideDetails") : t("showDetails")}
        </button>
      </div>

      {/* Expandable details */}
      <div
        className={styles.details}
        style={{ maxHeight: expanded ? 1000 : 0 }}
      >
        <div className="border-t border-white/5 p-6 pt-5 grid sm:grid-cols-2 gap-6">
          {/* Duties */}
          <div>
            <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">{t("duties")}</p>
            <ul className="space-y-1.5">
              {project.duties.map((duty) => (
                <li key={duty} className="flex items-start gap-2 text-white/60 text-sm">
                  <svg className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  {duty}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack + Team */}
          <div className="space-y-5">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">{t("techStack")}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((stackItem) => (
                  <span key={stackItem} className={styles.stackChip}>{stackItem}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">{t("teamComposition")}</p>
              <p className="text-white/50 text-sm">{project.teamDetail}</p>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">{t("scope")}</p>
              <p className="text-white/50 text-sm">{project.skills}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Link strip */}
      <LinkStrip link={project.link} t={t} />
    </article>
  );
}

function StoreLinks({ link, t }: { link: { appStore: string; playStore: string }; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  return (
    <>
      <a href={link.appStore} target="_blank" rel="noopener noreferrer" className={styles.linkStore}>
        <AppStoreLogo className="w-5 h-5 text-white/55 flex-shrink-0" />
        <span>
          <span className={styles.storeLabelTop}>Download on the</span>
          <span className={styles.storeLabelMain}>{t("appStore")}</span>
        </span>
      </a>
      <a href={link.playStore} target="_blank" rel="noopener noreferrer" className={styles.linkStore}>
        <GooglePlayLogo className="w-5 h-5 text-white/55 flex-shrink-0" />
        <span>
          <span className={styles.storeLabelTop}>Get it on</span>
          <span className={styles.storeLabelMain}>{t("googlePlay")}</span>
        </span>
      </a>
    </>
  );
}

function LinkStrip({ link, t }: { link: ProjectPageLink; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  if (link.type === "private") {
    return (
      <div className={styles.linkStrip}>
        <span className={styles.linkTypeLabel}>{t("links")}</span>
        <div className={styles.linkPrivateWrap}>
          <span className={styles.linkPrivate}>
            <LockIcon className="w-3.5 h-3.5 flex-shrink-0" />
            {t("privateLabel")}
          </span>
          <div className={styles.linkPrivateTooltip}>{t("privateTooltip")}</div>
        </div>
      </div>
    );
  }

  if (link.type === "mobile") {
    return (
      <div className={styles.linkStrip}>
        <span className={styles.linkTypeLabel}>{t("links")}</span>
        <StoreLinks link={link} t={t} />
      </div>
    );
  }

  if (link.type === "web") {
    return (
      <div className={styles.linkStrip}>
        <span className={styles.linkTypeLabel}>{t("links")}</span>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkWeb}>
          <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {t("liveApp")}
        </a>
      </div>
    );
  }

  if (link.type === "web+mobile") {
    return (
      <div className={styles.linkStrip}>
        <span className={styles.linkTypeLabel}>{t("links")}</span>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkWeb}>
          <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {t("liveApp")}
        </a>
        <StoreLinks link={link} t={t} />
      </div>
    );
  }

  return null;
}
