"use client";

import { useState, type CSSProperties } from "react";
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
    <div className={styles.metaRow}>
      {icon}
      <span>{value}</span>
    </div>
  );
}

type ProjectCardProps = {
  project: Project
  /** Capture scroll position before navigating into the case study so the
      hub can restore the user to the originating card on back-nav. */
  onNavigate?: (projectId: number) => void
  animationDelay?: number
  featured?: boolean
}

type ProjectIconColor = Project["iconColor"]

type ProjectIconStyle = CSSProperties & {
  "--project-icon-color-dark"?: string
  "--project-icon-color-light"?: string
  "--project-icon-mask"?: string
}

function resolveProjectIcon(logo: string, iconColor?: ProjectIconColor) {
  const hasDarkColor = Boolean(iconColor?.dark)
  const hasLightColor = Boolean(iconColor?.light)
  const style: ProjectIconStyle | undefined = hasDarkColor || hasLightColor
    ? {
        "--project-icon-color-dark": iconColor?.dark,
        "--project-icon-color-light": iconColor?.light,
        "--project-icon-mask": `url("${logo}")`,
      }
    : undefined

  return { hasDarkColor, hasLightColor, style }
}

export function ProjectCard({ project, onNavigate, animationDelay = 0, featured = false }: ProjectCardProps) {
  const t = useTranslations("projectsPage");
  const [entered, setEntered] = useState(false);
  const isPrivate = project.link.type === "private";
  const ctaLabel = isPrivate ? t("readApproach") : t("viewCaseStudy");
  const title = getProjectTitle(project);

  return (
    // Legacy `id="project-{id}"` retained so old hash links (LinkedIn pins,
    // cold emails, indexed fragments) still scroll to the right card.
    <article
      id={`project-${project.id}`}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""} ${entered ? "" : styles.cardEntrance} glass scroll-mt-28`}
      style={entered ? undefined : { animationDelay: `${animationDelay}s` }}
      onAnimationEnd={(animationEvent) => {
        if (animationEvent.target === animationEvent.currentTarget && !entered) setEntered(true);
      }}
    >
      {/* Whole-card body is the link target. The link strip lives outside the
         link to avoid nested <a> hydration errors in React 19. */}
      <Link
        href={`/projects/${project.slug}`}
        className={styles.cardLink}
        prefetch={false}
        onClick={() => onNavigate?.(project.id)}
        aria-label={`${ctaLabel}: ${title}`}
      >
        {/* Card header */}
        <div className={styles.cardContent}>
          <div className={styles.cardMain}>
            <div className={styles.cardTop}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTags}>
                  <Tag variant={project.scale === "Solo build" ? "green" : "neutral"}>{project.scale}</Tag>
                  {project.devTypes.map((devType) => (
                    <Tag key={devType}>{devType}</Tag>
                  ))}
                  <span className={styles.metaBadge}>{project.productType}</span>
                  <span className={styles.metaBadge}>{project.industry}</span>
                  {project.year && (
                    <span className="text-ghost-foreground text-xs font-mono">{project.year}</span>
                  )}
                </div>

                <h2 className={styles.cardTitle}>{title}</h2>
              </div>

              <ProjectAppIcon logo={project.logo} iconColor={project.iconColor} />
            </div>

            <div className={styles.metaGrid}>
              <MetaRow icon={<BuildingOfficeIcon className={`w-3.5 h-3.5 flex-shrink-0 ${styles.metaIcon}`} />} value={project.company} />
              <MetaRow icon={<UserIcon className={`w-3.5 h-3.5 flex-shrink-0 ${styles.metaIcon}`} />} value={project.role} />
              <MetaRow icon={<UsersIcon className={`w-3.5 h-3.5 flex-shrink-0 ${styles.metaIcon}`} />} value={`Team ${project.teamLabel}`} />
            </div>

            {/* Problem */}
            {project.problem && (
              <p className={styles.problem}>{project.problem}</p>
            )}

            {/* Description */}
            <p className={styles.description}>{project.description}</p>

            {/* Achievements */}
            {project.achievements.length > 0 && (
              <div className={styles.outcomes}>
                <p className={styles.outcomesLabel}>
                  {t("achievementsLabel")}
                </p>
                <ul className={styles.outcomesList}>
                  {project.achievements.map((achievement) => (
                    <li key={achievement} className={styles.outcomesItem}>
                      <LightningIcon className="w-4 h-4 text-amber-foreground flex-shrink-0 mt-0.5" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Read-more affordance */}
        <div className={styles.readMore}>
          <span>{ctaLabel}</span>
          <ArrowRightIcon className="w-3.5 h-3.5" aria-hidden />
        </div>
      </Link>

      {/* Link strip — outside the card link to keep external <a>s legal */}
      <LinkStrip link={project.link} logo={project.logo} iconColor={project.iconColor} t={t} />
    </article>
  );
}

function ProjectLogo({
  logo,
  iconColor,
  size,
  width,
  height,
  className,
  onError,
}: {
  logo: string
  iconColor?: ProjectIconColor
  size: "app" | "inline"
  width: number
  height: number
  className: string
  onError: () => void
}) {
  const { hasDarkColor, hasLightColor, style } = resolveProjectIcon(logo, iconColor)

  return (
    <span
      // `data-project-logo` is a query handle used by ProjectCard.test.tsx.
      className={`${styles.projectLogo} ${size === "app" ? styles.projectLogoApp : styles.projectLogoInline}`}
      data-project-logo={size}
      data-has-dark-icon-color={hasDarkColor ? "true" : undefined}
      data-has-light-icon-color={hasLightColor ? "true" : undefined}
      style={style}
    >
      <Image
        src={logo}
        alt=""
        width={width}
        height={height}
        className={`${className} ${styles.projectLogoOriginal}`}
        onError={onError}
      />
      {hasDarkColor && <span className={`${styles.projectLogoMask} ${styles.projectLogoMaskDark}`} aria-hidden="true" />}
      {hasLightColor && <span className={`${styles.projectLogoMask} ${styles.projectLogoMaskLight}`} aria-hidden="true" />}
    </span>
  )
}

function ProjectAppIcon({ logo, iconColor }: { logo?: string; iconColor?: ProjectIconColor }) {
  const [logoFailed, setLogoFailed] = useState(false)

  if (!logo || logoFailed) return null

  return (
    <span className={styles.projectIcon} aria-hidden="true">
      <ProjectLogo
        logo={logo}
        iconColor={iconColor}
        size="app"
        width={52}
        height={52}
        className={styles.projectIconImage}
        onError={() => setLogoFailed(true)}
      />
    </span>
  )
}

function StoreLinks({ link, t }: { link: { appStore: string; playStore: string }; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  return (
    <>
      <a href={link.appStore} target="_blank" rel="noopener noreferrer" className={styles.linkStore}>
        <AppStoreLogo className={styles.storeIcon} />
        <span>
          <span className={styles.storeLabelTop}>Download on the</span>
          <span className={styles.storeLabelMain}>{t("appStore")}</span>
        </span>
      </a>
      <a href={link.playStore} target="_blank" rel="noopener noreferrer" className={styles.linkStore}>
        <GooglePlayLogo className={styles.storeIcon} />
        <span>
          <span className={styles.storeLabelTop}>Get it on</span>
          <span className={styles.storeLabelMain}>{t("googlePlay")}</span>
        </span>
      </a>
    </>
  );
}

function WebLink({ url, label, logo, iconColor }: { url: string; label: string; logo?: string; iconColor?: ProjectIconColor }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.linkWeb}>
      {logo && !logoFailed ? (
        <ProjectLogo
          logo={logo}
          iconColor={iconColor}
          size="inline"
          width={20}
          height={20}
          className={styles.inlineLogoImage}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <ExternalLinkIcon className={styles.linkIcon} />
      )}
      {label}
    </a>
  );
}

function PrivateBadge({ label, tooltip, logo, iconColor }: { label: string; tooltip: string; logo?: string; iconColor?: ProjectIconColor }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <div className={styles.linkPrivateWrap}>
      <span className={styles.linkPrivate}>
        {logo && !logoFailed ? (
          <ProjectLogo
            logo={logo}
            iconColor={iconColor}
            size="inline"
            width={20}
            height={20}
            className={styles.inlineLogoImage}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <LockIcon className={styles.linkIcon} />
        )}
        {label}
      </span>
      <div className={styles.linkPrivateTooltip}>{tooltip}</div>
    </div>
  );
}

function LinkStrip({ link, logo, iconColor, t }: { link: ProjectPageLink; logo?: string; iconColor?: ProjectIconColor; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  const isPrimaryWeb = link.type === "web" || link.type === "web+mobile"
  const isPrimaryPrivate = link.type === "private"
  return (
    <div className={styles.linkStrip}>
      <span className={styles.linkTypeLabel}>{t("links")}</span>
      {link.type === "private" && (
        <PrivateBadge label={t("privateLabel")} tooltip={t("privateTooltip")} logo={isPrimaryPrivate ? logo : undefined} iconColor={iconColor} />
      )}
      {(link.type === "web" || link.type === "web+mobile") && (
        <WebLink url={link.url} label={t("liveApp")} logo={isPrimaryWeb ? logo : undefined} iconColor={iconColor} />
      )}
      {(link.type === "mobile" || link.type === "web+mobile") && (
        <StoreLinks link={link} t={t} />
      )}
    </div>
  );
}
