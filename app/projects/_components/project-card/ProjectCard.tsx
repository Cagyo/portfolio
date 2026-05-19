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

const metaBadgeClass =
  "inline-flex items-center bg-card border border-border text-muted-foreground text-[0.65rem] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded";

const metaIconClass = "w-3.5 h-3.5 flex-shrink-0 text-amber-foreground/70";

function MetaRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 min-w-0 text-muted-foreground text-sm">
      {icon}
      <span className="truncate">{value}</span>
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

  const featuredFrameClass = featured
    ? "border-[color-mix(in_srgb,var(--amber)_16%,transparent)]"
    : "";
  const entranceClass = entered ? "" : "animate-card-in";

  return (
    // Legacy `id="project-{id}"` retained so old hash links (LinkedIn pins,
    // cold emails, indexed fragments) still scroll to the right card.
    <article
      id={`project-${project.id}`}
      className={`${styles.card} group/card glass scroll-mt-28 overflow-hidden rounded-lg transition-[background-color,border-color,transform] duration-[250ms] hover:bg-card-hover hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${featuredFrameClass} ${entranceClass}`}
      style={entered ? undefined : { animationDelay: `${animationDelay}s` }}
      onAnimationEnd={(animationEvent) => {
        if (animationEvent.target === animationEvent.currentTarget && !entered) setEntered(true);
      }}
    >
      {/* Whole-card body is the link target. The link strip lives outside the
         link to avoid nested <a> hydration errors in React 19. */}
      <Link
        href={`/projects/${project.slug}`}
        className="block text-inherit no-underline"
        prefetch={false}
        onClick={() => onNavigate?.(project.id)}
        aria-label={`${ctaLabel}: ${title}`}
      >
        {/* Card header */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 px-6 pt-6 pb-2">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="grid flex-1 gap-[0.45rem] min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag variant={project.scale === "Solo build" ? "green" : "neutral"}>{project.scale}</Tag>
                  {project.devTypes.map((devType) => (
                    <Tag key={devType}>{devType}</Tag>
                  ))}
                  <span className={metaBadgeClass}>{project.productType}</span>
                  <span className={metaBadgeClass}>{project.industry}</span>
                  {project.year && (
                    <span className="text-ghost-foreground text-xs font-mono">{project.year}</span>
                  )}
                </div>

                <h2
                  className={`text-foreground font-heading font-black leading-[1.08] ${featured ? "text-[clamp(1.55rem,4.4vw,2rem)]" : "text-[clamp(1.25rem,3.4vw,1.55rem)]"}`}
                >
                  {title}
                </h2>
              </div>

              <ProjectAppIcon logo={project.logo} iconColor={project.iconColor} />
            </div>

            <div className="flex flex-wrap gap-y-[0.55rem] gap-x-4 mt-[0.95rem]">
              <MetaRow icon={<BuildingOfficeIcon className={metaIconClass} />} value={project.company} />
              <MetaRow icon={<UserIcon className={metaIconClass} />} value={project.role} />
              <MetaRow icon={<UsersIcon className={metaIconClass} />} value={`Team ${project.teamLabel}`} />
            </div>

            {/* Problem */}
            {project.problem && (
              <p className="text-amber-foreground/85 italic text-sm leading-[1.55] mt-[1.15rem] mb-[0.55rem]">
                {project.problem}
              </p>
            )}

            {/* Description */}
            <p className="text-muted-foreground text-[0.95rem] leading-[1.65]">{project.description}</p>

            {/* Achievements */}
            {project.achievements.length > 0 && (
              <div className="mt-[1.1rem] pt-4 border-t border-border-amber/60">
                <p className="mb-[0.55rem] text-amber-foreground/85 text-[0.7rem] font-bold tracking-[0.05em] uppercase">
                  {t("achievementsLabel")}
                </p>
                <ul className="grid gap-[0.35rem]">
                  {project.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2 text-foreground-soft text-[0.9rem] leading-[1.55]">
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
        <div className="flex items-center gap-1.5 px-6 pt-2.5 pb-3.5 text-xs font-semibold tracking-[0.04em] uppercase text-amber-foreground/80 transition-colors duration-200 group-hover/card:text-amber-foreground">
          <span>{ctaLabel}</span>
          <ArrowRightIcon
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5"
            aria-hidden
          />
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
  const sizeClass = size === "app" ? "w-[74%] h-[74%]" : "w-5 h-5 rounded-[5px]"

  return (
    <span
      // `data-project-logo` is a query handle used by ProjectCard.test.tsx.
      className={`${styles.projectLogo} ${sizeClass}`}
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
    <span
      className="flex items-center justify-center flex-shrink-0 w-13 h-13 overflow-hidden rounded-[10px] bg-card border border-border"
      aria-hidden="true"
    >
      <ProjectLogo
        logo={logo}
        iconColor={iconColor}
        size="app"
        width={52}
        height={52}
        className="w-full h-full object-contain [filter:saturate(0.92)_drop-shadow(0_1px_8px_color-mix(in_srgb,var(--bg)_42%,transparent))]"
        onError={() => setLogoFailed(true)}
      />
    </span>
  )
}

const linkStoreClass =
  "group/store inline-flex items-center justify-center gap-[9px] min-h-10 px-3.5 py-[7px] rounded-[10px] bg-card border border-border text-foreground-soft no-underline transition-[background-color,border-color,color,transform] duration-200 hover:bg-card-hover hover:border-border-amber hover:text-foreground hover:-translate-y-px cursor-pointer flex-shrink-0 max-sm:justify-center motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const storeIconClass =
  "w-5 h-5 flex-shrink-0 text-current transition-colors duration-200 group-hover/store:text-amber-foreground";

const storeLabelTopClass =
  "text-ghost-foreground text-[0.6rem] leading-none mb-px block transition-colors duration-200 group-hover/store:text-foreground-soft";

const storeLabelMainClass =
  "text-foreground-soft text-[0.78rem] font-semibold leading-none block transition-colors duration-200 group-hover/store:text-foreground";

function StoreLinks({ link, t }: { link: { appStore: string; playStore: string }; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  return (
    <>
      <a href={link.appStore} target="_blank" rel="noopener noreferrer" className={linkStoreClass}>
        <AppStoreLogo className={storeIconClass} />
        <span>
          <span className={storeLabelTopClass}>Download on the</span>
          <span className={storeLabelMainClass}>{t("appStore")}</span>
        </span>
      </a>
      <a href={link.playStore} target="_blank" rel="noopener noreferrer" className={linkStoreClass}>
        <GooglePlayLogo className={storeIconClass} />
        <span>
          <span className={storeLabelTopClass}>Get it on</span>
          <span className={storeLabelMainClass}>{t("googlePlay")}</span>
        </span>
      </a>
    </>
  );
}

const linkWebClass =
  "inline-flex items-center justify-center gap-[7px] min-h-10 px-4 py-[7px] rounded-[10px] text-[0.8rem] font-semibold bg-amber/8 border border-[color-mix(in_srgb,var(--amber)_22%,transparent)] text-amber-foreground no-underline transition-[background-color,border-color,color,transform] duration-200 hover:bg-amber/15 hover:border-border-amber hover:text-amber-foreground/90 hover:-translate-y-px cursor-pointer flex-shrink-0 max-sm:justify-center motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const linkIconClass = "w-3.5 h-3.5 flex-shrink-0";

const inlineLogoImageClass =
  "w-full h-full rounded-[5px] object-contain [filter:drop-shadow(0_1px_5px_color-mix(in_srgb,var(--bg)_38%,transparent))]";

function WebLink({ url, label, logo, iconColor }: { url: string; label: string; logo?: string; iconColor?: ProjectIconColor }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={linkWebClass}>
      {logo && !logoFailed ? (
        <ProjectLogo
          logo={logo}
          iconColor={iconColor}
          size="inline"
          width={20}
          height={20}
          className={inlineLogoImageClass}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <ExternalLinkIcon className={linkIconClass} />
      )}
      {label}
    </a>
  );
}

function PrivateBadge({ label, tooltip, logo, iconColor }: { label: string; tooltip: string; logo?: string; iconColor?: ProjectIconColor }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <div className="relative inline-flex group/private max-sm:w-full">
      <span className="inline-flex items-center justify-center gap-[7px] min-h-10 px-3.5 py-[7px] rounded-[10px] bg-card border border-border text-ghost-foreground text-[0.8rem] font-medium cursor-not-allowed select-none max-sm:justify-center max-sm:w-full">
        {logo && !logoFailed ? (
          <ProjectLogo
            logo={logo}
            iconColor={iconColor}
            size="inline"
            width={20}
            height={20}
            className={inlineLogoImageClass}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <LockIcon className={linkIconClass} />
        )}
        {label}
      </span>
      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-background-elevated border border-border text-faint-foreground text-[0.68rem] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-[180ms] z-10 group-hover/private:opacity-100">
        {tooltip}
      </div>
    </div>
  );
}

function LinkStrip({ link, logo, iconColor, t }: { link: ProjectPageLink; logo?: string; iconColor?: ProjectIconColor; t: ReturnType<typeof useTranslations<"projectsPage">> }) {
  const isPrimaryWeb = link.type === "web" || link.type === "web+mobile"
  const isPrimaryPrivate = link.type === "private"
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-3.5 border-t border-border max-sm:flex-col max-sm:items-stretch">
      <span className="text-ghost-foreground text-[0.65rem] font-semibold tracking-[0.06em] uppercase mr-0.5">{t("links")}</span>
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
