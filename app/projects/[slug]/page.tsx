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

  const { pageUrl, imageUrl } = buildCaseStudyUrls(project.slug);
  const articleSchema = buildCaseStudySchema({ project, pageUrl, imageUrl });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: tHub("title"), path: "/projects" },
    { name: title, path: caseStudyPath(project.slug) },
  ]);

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
        <header className={styles.hero} aria-labelledby="case-study-title">
          <div
            className={styles.heroGrid}
            data-no-visual={project.screenshots?.length ? undefined : "true"}
          >
            <div className={styles.heroText}>
              <h1 id="case-study-title" className={styles.title}>
                {title}
              </h1>
              {project.problem ? (
                <p className={styles.problem}>{project.problem}</p>
              ) : null}

              {heroProofItems.length > 0 ? (
                <ProofHighlights items={heroProofItems} />
              ) : null}

              <div className={styles.heroMeta}>
                {project.devTypes.map((devType) => (
                  <Tag key={devType}>{devType}</Tag>
                ))}
                <span className={styles.metaBadge}>{project.productType}</span>
                <span className={styles.metaBadge}>{project.industry}</span>
                {project.year ? (
                  <span className={styles.year}>{project.year}</span>
                ) : null}
                {isPrivate ? (
                  <span className={styles.ndaBadge}>
                    <LockIcon className="w-3.5 h-3.5" aria-hidden />
                    {t("ndaBadge")}
                  </span>
                ) : null}
              </div>

              <div className={styles.metaStrip}>
                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt=""
                    width={24}
                    height={24}
                    className={styles.metaStripLogo}
                  />
                ) : null}
                <span className={styles.metaStripItem}>
                  <span className={styles.metaStripLabel}>
                    {t("metaCompany")}
                  </span>
                  <span className={styles.metaStripValue}>
                    {project.company}
                  </span>
                </span>
                <span className={styles.metaStripItem}>
                  <span className={styles.metaStripLabel}>
                    {t("metaRole")}
                  </span>
                  <span className={styles.metaStripValue}>{project.role}</span>
                </span>
                <span className={styles.metaStripItem}>
                  <span className={styles.metaStripLabel}>
                    {t("metaTeam")}
                  </span>
                  <span className={styles.metaStripValue}>
                    {`${t("teamPrefix")} ${project.teamLabel}`}
                  </span>
                </span>
              </div>

              {/* Primary CTA above the fold */}
              <div className={styles.heroCta}>
                <Button
                  href={`/?ref=${project.slug}#contact`}
                  variant="primary"
                  className="px-6 py-3 rounded-xl text-sm gap-2"
                >
                  {t("primaryCta")}
                  <ArrowRightIcon className="w-4 h-4" aria-hidden />
                </Button>
                <span className={styles.heroCtaHint}>
                  {t("primaryCtaHint")}
                </span>
              </div>
            </div>
            {project.screenshots?.length ? (
              <div className={styles.heroVisual}>
                <ProjectScreenshots
                  screenshots={project.screenshots}
                  projectTitle={title}
                  variant="hero"
                />
              </div>
            ) : null}
          </div>
        </header>

        <div className={styles.body}>
          {/* Band 1 — Overview (description + scope) */}
          <Band heading={t("overviewHeading")}>
            <p className={styles.bodyText}>{project.description}</p>
            <SubBlock kicker={t("scopeHeading")}>
              <p className={styles.bodyText}>{project.skills}</p>
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
                <p className={styles.bodyText}>{project.approach}</p>
              ) : null}
              {project.duties.length > 0 ? (
                project.approach ? (
                  <SubBlock kicker={t("dutiesHeading")}>
                    <ul className={styles.dutiesList}>
                      {project.duties.map((duty) => (
                        <li key={duty} className={styles.dutyItem}>
                          <span className={styles.dutyDot} aria-hidden />
                          {duty}
                        </li>
                      ))}
                    </ul>
                  </SubBlock>
                ) : (
                  <ul className={styles.dutiesList}>
                    {project.duties.map((duty) => (
                      <li key={duty} className={styles.dutyItem}>
                        <span className={styles.dutyDot} aria-hidden />
                        {duty}
                      </li>
                    ))}
                  </ul>
                )
              ) : null}
              {project.teamDetail ? (
                <SubBlock kicker={t("teamHeading")}>
                  <p className={styles.bodyText}>{project.teamDetail}</p>
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
                <ul className={styles.achievementsList}>
                  {project.achievements.map((achievement) => (
                    <li key={achievement} className={styles.achievementItem}>
                      <span className={styles.dutyDot} aria-hidden />
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
                  <div className={styles.chipRow}>
                    {project.devTypes.map((devType) => (
                      <Link
                        key={devType}
                        href={`/projects?devTypes=${encodeURIComponent(devType)}`}
                        className={styles.linkChip}
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
          <div className={styles.bottomNav}>
            <Link
              href="/projects"
              className={styles.backLink}
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
    <ol className={styles.proofList}>
      {items.map((proofItem, proofIndex) => (
        <li key={proofItem} className={styles.proofItem}>
          <span className={styles.proofIndex} aria-hidden="true">
            {String(proofIndex + 1).padStart(2, "0")}
          </span>
          <span>{proofItem}</span>
        </li>
      ))}
    </ol>
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
    <section className={styles.band}>
      <h2 className={styles.bandHeading}>{heading}</h2>
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
    <div className={styles.subBlock}>
      <p className={styles.kickerLabel}>{kicker}</p>
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
    <div className={styles.validationStrip}>
      <span className={styles.linkTypeLabel}>{labels.links}</span>
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

function WebLink({ url, label, logo }: { url: string; label: string; logo?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkWeb}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={20}
          height={20}
          className="object-contain flex-shrink-0"
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
        className={styles.linkStore}
      >
        <AppStoreLogo className="w-5 h-5 flex-shrink-0" />
        <span>{appStoreLabel}</span>
      </a>
      <a
        href={playStore}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkStore}
      >
        <GooglePlayLogo className="w-5 h-5 flex-shrink-0" />
        <span>{playStoreLabel}</span>
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
    <span className={styles.privateBadge} title={tooltip}>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={20}
          height={20}
          className="object-contain flex-shrink-0"
        />
      ) : (
        <LockIcon className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {label}
    </span>
  );
}
