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
  getStackName,
  type ProjectPageLink,
  type Project,
} from "@/app/_data/projects/types";
import { Tag } from "@/app/_components/tag/Tag";
import { Button } from "@/app/_components/button/Button";
import { SubpageNav } from "@/app/_components/nav/SubpageNav";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import { getInitialIsDark } from "@/app/_components/theme/get-initial-is-dark";
import { ProjectScreenshots } from "@/app/projects/_components/project-card/ProjectScreenshots";
import { AppStoreLogo } from "@/assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "@/assets/logos/GooglePlayLogo";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { BuildingOfficeIcon } from "@/assets/icons/BuildingOfficeIcon";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LightningIcon } from "@/assets/icons/LightningIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { UsersIcon } from "@/assets/icons/UsersIcon";
import styles from "./project-detail.module.css";

const THIN_CONTENT_THRESHOLD_WORDS = 120;

function combinedProse(project: Project): string {
  return [
    project.description,
    project.problem ?? "",
    project.approach ?? "",
    ...project.achievements,
    ...project.duties,
    project.skills,
    project.teamDetail,
  ].join(" ");
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
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
  const description = project.problem ?? project.description.slice(0, 160);
  const { pageUrl } = buildCaseStudyUrls(project.slug);

  const isThin =
    wordCount(combinedProse(project)) < THIN_CONTENT_THRESHOLD_WORDS;

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

  const t = await getTranslations("projectDetail");
  const tHub = await getTranslations("projectsPage");
  const tNav = await getTranslations("nav");
  const initialIsDark = await getInitialIsDark();
  const isPrivate = project.link.type === "private";
  const title = getProjectTitle(project);

  const { pageUrl, imageUrl } = buildCaseStudyUrls(project.slug);
  const articleSchema = buildCaseStudySchema({ project, pageUrl, imageUrl });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: tHub("title"), path: "/projects" },
    { name: title, path: caseStudyPath(project.slug) },
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
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
          <h1 id="case-study-title" className={styles.title}>
            {title}
          </h1>
          {project.problem ? (
            <p className={styles.problem}>{project.problem}</p>
          ) : null}

          <ul className={styles.metaGrid} role="list">
            <MetaItem
              icon={<BuildingOfficeIcon className="w-4 h-4" />}
              label={t("metaCompany")}
              value={project.company}
            />
            <MetaItem
              icon={<UserIcon className="w-4 h-4" />}
              label={t("metaRole")}
              value={project.role}
            />
            <MetaItem
              icon={<UsersIcon className="w-4 h-4" />}
              label={t("metaTeam")}
              value={`${t("teamPrefix")} ${project.teamLabel}`}
            />
          </ul>

          {/* Primary CTA above the fold */}
          <div className={styles.heroCta}>
            <Button
              href="/#contact"
              variant="primary"
              className="px-6 py-3 rounded-xl text-sm gap-2"
            >
              {t("primaryCta")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <span className={styles.heroCtaHint}>{t("primaryCtaHint")}</span>
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
          {/* Description */}
          <Section heading={t("overviewHeading")}>
            <p className={styles.bodyText}>{project.description}</p>
          </Section>

          {/* Achievements */}
          {project.achievements.length > 0 ? (
            <Section heading={t("achievementsHeading")}>
              <ul className={styles.achievementsList}>
                {project.achievements.map((achievement) => (
                  <li key={achievement} className={styles.achievementItem}>
                    <LightningIcon
                      className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"
                      aria-hidden
                    />
                    {achievement}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* Approach (optional) */}
          {project.approach ? (
            <Section heading={t("approachHeading")}>
              <p className={styles.bodyText}>{project.approach}</p>
            </Section>
          ) : null}

          {/* Duties */}
          {project.duties.length > 0 ? (
            <Section heading={t("dutiesHeading")}>
              <ul className={styles.dutiesList}>
                {project.duties.map((duty) => (
                  <li key={duty} className={styles.dutyItem}>
                    <span className={styles.dutyDot} aria-hidden />
                    {duty}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* Tech Stack */}
          {project.stack.length > 0 ? (
            <Section heading={t("stackHeading")}>
              <div className={styles.chipRow}>
                {project.stack.map((stackItem) => {
                  const name = getStackName(stackItem);
                  return (
                    <Link
                      key={name}
                      href={`/projects?stackFilters=${encodeURIComponent(name)}`}
                      className={styles.linkChip}
                      prefetch={false}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {/* Dev Types */}
          {project.devTypes.length > 0 ? (
            <Section heading={t("devTypesHeading")}>
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
            </Section>
          ) : null}

          {/* Team + Scope */}
          <div className={styles.twoCol}>
            <Section heading={t("teamHeading")}>
              <p className={styles.bodyText}>{project.teamDetail}</p>
            </Section>
            <Section heading={t("scopeHeading")}>
              <p className={styles.bodyText}>{project.skills}</p>
            </Section>
          </div>

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
              <ArrowLeftIcon className="w-4 h-4" aria-hidden />
              {t("backToAll")}
            </Link>
            <Button
              href="/#contact"
              variant="primary"
              className="px-6 py-3 rounded-xl text-sm gap-2"
            >
              {t("secondaryCta")}
              <ArrowRightIcon className="w-4 h-4" aria-hidden />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>{heading}</h2>
      {children}
    </section>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className={styles.metaItem}>
      <span className={styles.metaIcon} aria-hidden>
        {icon}
      </span>
      <div>
        <p className={styles.metaLabel}>{label}</p>
        <p className={styles.metaValue}>{value}</p>
      </div>
    </li>
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
