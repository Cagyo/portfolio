"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { BuildingOfficeIcon } from "@/assets/icons/BuildingOfficeIcon";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LightningIcon } from "@/assets/icons/LightningIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { UsersIcon } from "@/assets/icons/UsersIcon";
import { AppStoreLogo } from "@/assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "@/assets/logos/GooglePlayLogo";
import { Tag } from "@/app/_components/tag/Tag";
import type { Project, ProjectPageLink } from "@/app/_data/projects/types";
import { getProjectTitle } from "@/app/_data/projects/types";
import styles from "./ProjectCard.module.css";

function MetaRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-white/60 text-sm">{value}</span>
    </div>
  );
}

type ProjectCardProps = {
  project: Project
  /** Capture scroll position before navigating into the case study so the
      hub can restore the user to the originating card on back-nav. */
  onNavigate?: (projectId: number) => void
  animationDelay?: number
}

export function ProjectCard({ project, onNavigate, animationDelay = 0 }: ProjectCardProps) {
  const t = useTranslations("projectsPage");
  const [entered, setEntered] = useState(false);
  const isPrivate = project.link.type === "private";
  const ctaLabel = isPrivate ? t("readApproach") : t("viewCaseStudy");

  return (
    // Legacy `id="project-{id}"` retained so old hash links (LinkedIn pins,
    // cold emails, indexed fragments) still scroll to the right card.
    <article
      id={`project-${project.id}`}
      className={`${styles.card} ${entered ? "" : styles.cardEntrance} glass rounded-2xl overflow-hidden scroll-mt-28`}
      style={entered ? undefined : { animationDelay: `${animationDelay}s` }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && !entered) setEntered(true);
      }}
    >
      {/* Whole-card body is the link target. The link strip lives outside the
         link to avoid nested <a> hydration errors in React 19. */}
      <Link
        href={`/projects/${project.slug}`}
        className={styles.cardLink}
        prefetch={false}
        onClick={() => onNavigate?.(project.id)}
        aria-label={`${ctaLabel}: ${getProjectTitle(project)}`}
      >
        {/* Card header */}
        <div className="p-6 pb-2">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {project.devTypes.map((devType) => (
                  <Tag key={devType}>{devType}</Tag>
                ))}
                <span className={styles.metaBadge}>{project.productType}</span>
                <span className={styles.metaBadge}>{project.industry}</span>
                {project.year && (
                  <span className="text-white/25 text-xs font-mono">{project.year}</span>
                )}
              </div>
              <h2 className="font-heading font-black text-xl text-white leading-tight">{getProjectTitle(project)}</h2>
            </div>

            {/* Meta column */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <MetaRow icon={<BuildingOfficeIcon className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" />} value={project.company} />
              <MetaRow icon={<UserIcon className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" />} value={project.role} />
              <MetaRow icon={<UsersIcon className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" />} value={`Team ${project.teamLabel}`} />
            </div>
          </div>

          {/* Problem */}
          {project.problem && (
            <p className="text-amber-400/70 text-xs italic mb-2">{project.problem}</p>
          )}

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed">{project.description}</p>

          {/* Achievements */}
          {project.achievements.length > 0 && (
            <div className="mt-4 glass-amber rounded-xl p-3.5">
              <p className="text-amber-500/70 text-xs uppercase tracking-widest font-bold mb-2">
                {t("achievementsLabel")}
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
        </div>

        {/* Read-more affordance */}
        <div className={styles.readMore}>
          <span>{ctaLabel}</span>
          <ArrowRightIcon className="w-3.5 h-3.5" aria-hidden />
        </div>
      </Link>

      {/* Link strip — outside the card link to keep external <a>s legal */}
      <LinkStrip link={project.link} logo={project.logo} t={t} />
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

function WebLink({ url, label, logo }: { url: string; label: string; logo?: string }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.linkWeb}>
      {logo && !logoFailed ? (
        <Image src={logo} alt="" width={20} height={20} className="object-contain flex-shrink-0" onError={() => setLogoFailed(true)} />
      ) : (
        <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {label}
    </a>
  );
}

function PrivateBadge({ label, tooltip, logo }: { label: string; tooltip: string; logo?: string }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <div className={styles.linkPrivateWrap}>
      <span className={styles.linkPrivate}>
        {logo && !logoFailed ? (
          <Image src={logo} alt="" width={20} height={20} className="object-contain flex-shrink-0" onError={() => setLogoFailed(true)} />
        ) : (
          <LockIcon className="w-3.5 h-3.5 flex-shrink-0" />
        )}
        {label}
      </span>
      <div className={styles.linkPrivateTooltip}>{tooltip}</div>
    </div>
  );
}

function LinkStrip({ link, logo, t }: { link: ProjectPageLink; logo?: string; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  const isPrimaryWeb = link.type === "web" || link.type === "web+mobile"
  const isPrimaryPrivate = link.type === "private"
  return (
    <div className={styles.linkStrip}>
      <span className={styles.linkTypeLabel}>{t("links")}</span>
      {link.type === "private" && (
        <PrivateBadge label={t("privateLabel")} tooltip={t("privateTooltip")} logo={isPrimaryPrivate ? logo : undefined} />
      )}
      {(link.type === "web" || link.type === "web+mobile") && (
        <WebLink url={link.url} label={t("liveApp")} logo={isPrimaryWeb ? logo : undefined} />
      )}
      {(link.type === "mobile" || link.type === "web+mobile") && (
        <StoreLinks link={link} t={t} />
      )}
    </div>
  );
}
