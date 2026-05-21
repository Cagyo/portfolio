import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { JsonLd } from "@/app/_schema/JsonLd";
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb";
import {
  buildCaseStudySchema,
  buildCaseStudyUrls,
  caseStudyPath,
} from "@/app/_schema/case-study";
import { siteConfig } from "@/app/_config/site-config";
import {
  getProjectBySlug,
  getProjects,
} from "@/app/_data/projects/get-projects";
import {
  getProjectTitle,
  type ProjectPageLink,
} from "@/app/_data/projects/types";
import { getProjectStackGroups } from "@/app/_data/projects/stack-groups";
import { isThinContent } from "@/app/_data/projects/is-thin-content";
import { Tag } from "@/app/_components/tag/Tag";
import { Button } from "@/app/_components/button/Button";
import { SubpageNav } from "@/app/_components/nav/SubpageNav";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import { getInitialIsDark } from "@/app/_components/theme/get-initial-is-dark";
import { ProjectScreenshots } from "@/app/projects/_components/project-card/ProjectScreenshots";
import { AppStoreLogo } from "@/assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "@/assets/logos/GooglePlayLogo";
import { ArrowLeftShortIcon } from "@/assets/icons/ArrowLeftShortIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { StackEvidence } from "./StackEvidence";
import styles from "./project-detail.module.css";

const companyLogos: Record<string, string> = {
  Allsquare: "/assets/companies/allsquare.jpg",
  "Avocado Technology": "/assets/companies/avocado_tech_logo.jpg",
  EngagePoint: "/assets/companies/engagepoint.jpg",
};

const metaBadgeClass =
  "inline-flex items-center bg-card border border-border text-muted-foreground text-[0.65rem] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded";

const ndaBadgeClass =
  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.65rem] font-semibold tracking-[0.04em] uppercase bg-card border border-border text-muted-foreground";

const bodyTextClass =
  "text-foreground-soft text-[1.0625rem] leading-[1.65] m-0 max-w-[75ch]";

const kickerLabelClass =
  "text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-faint-foreground m-0";

const dutyDotClass =
  "flex-shrink-0 w-1.5 h-1.5 rounded-full bg-foreground/35 mt-[9px]";

const linkChipClass =
  "inline-flex items-center min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground no-underline transition-[background-color,border-color,color] duration-200 hover:bg-card-hover hover:border-foreground/20 hover:text-foreground max-sm:min-h-11";

function trimToWordBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced) + "…";
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const title =
    project.seoTitle ?? `${getProjectTitle(project)} — ${siteConfig.author.name}`;
  const description =
    project.problem ?? trimToWordBoundary(project.description, 160);
  const { pageUrl } = buildCaseStudyUrls(project.slug);

  const isThin = isThinContent(project);

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    robots: isThin ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // Only canonical lowercase slugs are emitted by generateStaticParams; any
  // other casing 404s at the framework boundary, so no in-handler redirect
  // is needed.
  if (!project) notFound();

  const [t, tHub, tNav, tCommon, initialIsDark] = await Promise.all([
    getTranslations("projectDetail"),
    getTranslations("projectsPage"),
    getTranslations("nav"),
    getTranslations("common"),
    getInitialIsDark(),
  ]);
  const isPrivate = project.link.type === "private";
  const title = getProjectTitle(project);
  const companyLogo = companyLogos[project.company];
  const heroProofItems = (
    project.homeCard?.outcome.length
      ? project.homeCard.outcome
      : project.achievements
  ).slice(0, 3);
  const stackGroups = getProjectStackGroups(project.stack);
  const hasStackEvidence =
    stackGroups.primaryGroups.length > 0 ||
    stackGroups.secondaryGroups.length > 0;
  const hasScreenshots = Boolean(project.screenshots?.length);

  const { pageUrl, imageUrl } = buildCaseStudyUrls(project.slug);
  const articleSchema = buildCaseStudySchema({ project, pageUrl, imageUrl });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: tHub("title"), path: "/projects" },
    { name: title, path: caseStudyPath(project.slug) },
  ]);

  const heroGridClass = hasScreenshots
    ? "grid grid-cols-[minmax(0,1fr)_minmax(280px,360px)] gap-12 items-start max-md:grid-cols-1 max-md:gap-8"
    : "grid grid-cols-1 gap-12 items-start max-md:gap-8";

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <BlobBackground position="top-0 right-0" opacity={0.1} />
      <BlobBackground shade={600} position="-bottom-32 left-1/4" opacity={0.1} />

      <SubpageNav
        backHref="/projects"
        backLabel={t("backToHub")}
        maxWidth="max-w-6xl"
        cta={{ href: "/#contact", label: tNav("cta") }}
        rightExtras={<ThemeToggle initialIsDark={initialIsDark} />}
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero */}
        <header
          className="mb-14 pb-11 border-b border-border max-md:mb-11 max-md:pb-9"
          aria-labelledby="case-study-title"
        >
          <div className={heroGridClass}>
            <div className="max-w-none">
              <h1
                id="case-study-title"
                className="font-heading font-black text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-foreground m-0 mb-3 max-sm:text-[2.35rem]"
              >
                {title}
              </h1>
              {project.problem ? (
                <p className="text-amber-foreground/85 italic text-[1.0625rem] leading-[1.5] m-0 mb-5 max-w-[75ch]">
                  {project.problem}
                </p>
              ) : null}

              {heroProofItems.length > 0 ? (
                <ProofHighlights items={heroProofItems} />
              ) : null}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.devTypes.map((devType) => (
                  <Tag key={devType}>{devType}</Tag>
                ))}
                <span className={metaBadgeClass}>{project.productType}</span>
                <span className={metaBadgeClass}>{project.industry}</span>
                {project.year ? (
                  <span className="text-ghost-foreground text-xs font-mono">
                    {project.year}
                  </span>
                ) : null}
                {isPrivate ? (
                  <span className={ndaBadgeClass}>
                    <LockIcon className="w-3.5 h-3.5" aria-hidden />
                    {t("ndaBadge")}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-5 mb-6 list-none p-0 max-sm:items-start max-sm:flex-col">
                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt=""
                    width={24}
                    height={24}
                    className={`flex-shrink-0 object-contain rounded mr-1 ${styles.metaStripLogo}`}
                  />
                ) : null}
                <span className={styles.metaStripItem}>
                  <span className="text-faint-foreground/90 text-[0.65rem] font-semibold tracking-[0.06em] uppercase">
                    {t("metaCompany")}
                  </span>
                  <span className="text-foreground-soft text-[0.9rem] font-medium">
                    {project.company}
                  </span>
                </span>
                <span className={styles.metaStripItem}>
                  <span className="text-faint-foreground/90 text-[0.65rem] font-semibold tracking-[0.06em] uppercase">
                    {t("metaRole")}
                  </span>
                  <span className="text-foreground-soft text-[0.9rem] font-medium">
                    {project.role}
                  </span>
                </span>
                <span className={styles.metaStripItem}>
                  <span className="text-faint-foreground/90 text-[0.65rem] font-semibold tracking-[0.06em] uppercase">
                    {t("metaTeam")}
                  </span>
                  <span className="text-foreground-soft text-[0.9rem] font-medium">
                    {`${t("teamPrefix")} ${project.teamLabel}`}
                  </span>
                </span>
              </div>

              {/* Primary CTA above the fold */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <Button
                  href={`/?ref=${project.slug}#contact`}
                  variant="primary"
                  className="px-6 py-3 rounded-xl text-sm gap-2"
                >
                  {t("primaryCta")}
                  <ArrowRightIcon className="w-4 h-4" aria-hidden />
                </Button>
                <span className="text-[0.8rem] text-muted-foreground">
                  {t("primaryCtaHint")}
                </span>
              </div>
            </div>
            {project.screenshots?.length ? (
              <div className="w-full">
                <ProjectScreenshots
                  screenshots={project.screenshots}
                  projectTitle={title}
                  variant="hero"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-14">
          {/* Band 1 — Overview (description + scope) */}
          <Band heading={t("overviewHeading")}>
            <p className={bodyTextClass}>{project.description}</p>
            <SubBlock kicker={t("scopeHeading")}>
              <p className={bodyTextClass}>{project.skills}</p>
            </SubBlock>
          </Band>

          {/* Band 2 — Approach (approach narrative + duties + team) */}
          {(project.approach ||
            project.duties.length > 0 ||
            project.teamDetail) ? (
            <Band
              heading={
                project.approach
                  ? t("approachHeading")
                  : t("dutiesHeading")
              }
            >
              {project.approach ? (
                <p className={bodyTextClass}>{project.approach}</p>
              ) : null}
              {project.duties.length > 0 ? (
                project.approach ? (
                  <SubBlock kicker={t("dutiesHeading")}>
                    <DutiesList duties={project.duties} />
                  </SubBlock>
                ) : (
                  <DutiesList duties={project.duties} />
                )
              ) : null}
              {project.teamDetail ? (
                <SubBlock kicker={t("teamHeading")}>
                  <p className={bodyTextClass}>{project.teamDetail}</p>
                </SubBlock>
              ) : null}
            </Band>
          ) : null}

          {/* Band 3 — Achievements (achievements + stack + dev types) */}
          {(project.achievements.length > 0 ||
            project.stack.length > 0 ||
            project.devTypes.length > 0) ? (
            <Band heading={t("achievementsHeading")}>
              {project.achievements.length > 0 ? (
                <ul className="flex flex-col gap-2 max-w-[75ch] m-0 p-0 list-none">
                  {project.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-2.5 text-foreground/90 text-[0.95rem] leading-[1.5]"
                    >
                      <span className={dutyDotClass} aria-hidden />
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasStackEvidence ? (
                <SubBlock kicker={t("stackHeading")}>
                  <StackEvidence
                    primaryGroups={stackGroups.primaryGroups}
                    secondaryGroups={stackGroups.secondaryGroups}
                    showMoreLabel={tCommon("showMore")}
                    showLessLabel={tCommon("showLess")}
                  />
                </SubBlock>
              ) : null}
              {project.devTypes.length > 0 ? (
                <SubBlock kicker={t("devTypesHeading")}>
                  <div className="flex flex-wrap gap-1.5">
                    {project.devTypes.map((devType) => (
                      <Link
                        key={devType}
                        href={`/projects?devTypes=${encodeURIComponent(devType)}`}
                        className={linkChipClass}
                        prefetch={false}
                      >
                        {devType}
                      </Link>
                    ))}
                  </div>
                </SubBlock>
              ) : null}
            </Band>
          ) : null}

          {/* Validation strip */}
          <ValidationStrip
            link={project.link}
            logo={project.logo}
            labels={{
              links: tHub("links"),
              liveApp: tHub("liveApp"),
              appStore: tHub("appStore"),
              googlePlay: tHub("googlePlay"),
              privateLabel: tHub("privateLabel"),
              privateTooltip: tHub("privateTooltip"),
            }}
          />

          {/* Bottom nav: back to hub + secondary contact CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-6 border-t border-border">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
              prefetch={false}
            >
              <ArrowLeftShortIcon className="w-4 h-4" aria-hidden />
              {t("backToAll")}
            </Link>
            <Button
              href={`/?ref=${project.slug}#contact`}
              variant="primary"
              className="px-6 py-3 rounded-xl text-sm gap-2"
            >
              {t("secondaryCta")}
              <ArrowRightIcon className="w-4 h-4" aria-hidden />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function ProofHighlights({ items }: { items: readonly string[] }) {
  return (
    <ol className="flex flex-col gap-2.5 max-w-[44ch] m-0 mb-6 py-3.5 px-0 list-none border-y border-border">
      {items.map((proofItem, proofIndex) => (
        <li
          key={proofItem}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 text-foreground/85 text-[0.95rem] leading-[1.5] max-sm:grid-cols-[2rem_minmax(0,1fr)]"
        >
          <span
            className="text-amber-foreground/85 font-mono text-[0.7rem] leading-[2]"
            aria-hidden="true"
          >
            {String(proofIndex + 1).padStart(2, "0")}
          </span>
          <span>{proofItem}</span>
        </li>
      ))}
    </ol>
  );
}

function DutiesList({ duties }: { duties: readonly string[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 gap-2 list-none m-0 p-0">
      {duties.map((duty) => (
        <li
          key={duty}
          className="flex items-start gap-2.5 text-foreground-soft text-[0.95rem] leading-[1.5]"
        >
          <span className={dutyDotClass} aria-hidden />
          {duty}
        </li>
      ))}
    </ul>
  );
}

function Band({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-heading font-extrabold text-[1.625rem] leading-[1.2] text-foreground m-0 max-sm:text-[1.35rem]">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function SubBlock({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className={kickerLabelClass}>{kicker}</p>
      {children}
    </div>
  );
}

type ValidationLabels = {
  links: string;
  liveApp: string;
  appStore: string;
  googlePlay: string;
  privateLabel: string;
  privateTooltip: string;
};

function ValidationStrip({
  link,
  logo,
  labels,
}: {
  link: ProjectPageLink;
  logo?: string;
  labels: ValidationLabels;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 px-5 py-4 rounded-[0.875rem] bg-foreground/[0.03] border border-border">
      <span className="text-[0.65rem] font-semibold tracking-[0.06em] uppercase text-ghost-foreground mr-1.5">
        {labels.links}
      </span>
      {link.type === "private" ? (
        <PrivateBadge label={labels.privateLabel} tooltip={labels.privateTooltip} logo={logo} />
      ) : null}
      {link.type === "web" || link.type === "web+mobile" ? (
        <WebLink url={link.url} label={labels.liveApp} logo={logo} />
      ) : null}
      {link.type === "mobile" || link.type === "web+mobile" ? (
        <StoreLinks
          appStore={link.appStore}
          playStore={link.playStore}
          appStoreLabel={labels.appStore}
          playStoreLabel={labels.googlePlay}
        />
      ) : null}
    </div>
  );
}

const linkWebClass =
  "inline-flex items-center gap-2 px-4 py-2 rounded-[0.625rem] text-[0.8rem] font-semibold bg-amber/10 border border-[color-mix(in_srgb,var(--amber)_24%,transparent)] text-amber-foreground no-underline transition-[background-color,border-color,color] duration-200 hover:bg-amber/18 hover:border-border-amber hover:text-amber-foreground/90";

const linkStoreClass =
  "group/store hover-transitions inline-flex items-center gap-2 px-3.5 py-2 rounded-[0.625rem] text-[0.8rem] font-semibold text-foreground-soft bg-card border border-border no-underline hover:bg-card-hover hover:border-border-amber hover:text-foreground";

const storeIconClass =
  "w-5 h-5 flex-shrink-0 text-current transition-colors duration-200 group-hover/store:text-amber-foreground";

function WebLink({ url, label, logo }: { url: string; label: string; logo?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={linkWebClass}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={20}
          height={20}
          className={`w-5 h-5 flex-shrink-0 rounded-[5px] object-contain ${styles.inlineLogo}`}
        />
      ) : (
        <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {label}
    </a>
  );
}

function StoreLinks({
  appStore,
  playStore,
  appStoreLabel,
  playStoreLabel,
}: {
  appStore: string;
  playStore: string;
  appStoreLabel: string;
  playStoreLabel: string;
}) {
  return (
    <>
      <a
        href={appStore}
        target="_blank"
        rel="noopener noreferrer"
        className={linkStoreClass}
      >
        <AppStoreLogo className={storeIconClass} />
        <span className="transition-colors duration-200">{appStoreLabel}</span>
      </a>
      <a
        href={playStore}
        target="_blank"
        rel="noopener noreferrer"
        className={linkStoreClass}
      >
        <GooglePlayLogo className={storeIconClass} />
        <span className="transition-colors duration-200">{playStoreLabel}</span>
      </a>
    </>
  );
}

function PrivateBadge({
  label,
  tooltip,
  logo,
}: {
  label: string;
  tooltip: string;
  logo?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[0.625rem] text-[0.8rem] font-semibold bg-card border border-border text-muted-foreground"
      title={tooltip}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={20}
          height={20}
          className={`w-5 h-5 flex-shrink-0 rounded-[5px] object-contain ${styles.inlineLogo}`}
        />
      ) : (
        <LockIcon className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {label}
    </span>
  );
}
