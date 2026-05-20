import { getTranslations } from "next-intl/server";
import { getProjects } from "@/app/_data/projects/get-projects";
import { getProjectTitle, getStackName, overlayTypeFor } from "@/app/_data/projects/types";
import { HOME_PROJECT_IDS, getHomeProjectVisual } from "@/app/_data/home-project-visuals";
import { isFilterableStack } from "@/app/_data/projects/get-stack-stats";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { ArrowRightShortIcon } from "@/assets/icons/ArrowRightShortIcon";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { Button } from "@/app/_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { ProjectLinkOverlay } from "./ProjectLinkOverlay";
import { AnonymizedImageContent } from "./AnonymizedImageContent";
type ProjectsSectionProps = { sectionNumber?: string }

export async function ProjectsSection({ sectionNumber }: ProjectsSectionProps) {
  const t = await getTranslations("projects");

  const allProjects = await getProjects();
  const projects = HOME_PROJECT_IDS.map((id) => {
    const project = allProjects.find((candidate) => candidate.id === id);

    if (!project) {
      throw new Error(`Missing home project with id ${id}`);
    }

    return project;
  });
  const featuredProject = projects.find((project) => project.featured) ?? projects.at(0);
  const supportingProjects = featuredProject
    ? projects.filter((project) => project.id !== featuredProject.id)
    : [];

  const renderProjectCard = (project: (typeof projects)[number], isFeatured: boolean) => {
    const visuals = getHomeProjectVisual(project.id);
    const homeCard = project.homeCard;
    const blurredSrc = project.screenshots?.find((screenshot) => screenshot.kind === "blurred")?.src;

    return (
      <ProjectCard
        key={project.id}
        title={getProjectTitle(project)}
        description={project.description}
        problem={homeCard?.problem}
        outcome={homeCard?.outcome}
        meta={{ category: project.industry, role: project.role, year: project.year }}
        badge={{ icon: visuals?.icon, label: homeCard?.buyerBadge ?? '' }}
        tags={project.stack.map(getStackName).filter(isFilterableStack)}
        imageBg={project.imageBg ?? ''}
        imageContent={
          <>
            {visuals?.imageContent}
            {blurredSrc && <AnonymizedImageContent src={blurredSrc} />}
          </>
        }
        linkOverlay={
          <ProjectLinkOverlay
            overlayType={overlayTypeFor(project.link)}
            link={project.link}
            hasBlurredImage={!!blurredSrc}
          />
        }
        featured={isFeatured}
        viewInProjectsHref={`/projects/${project.slug}`}
        viewInProjectsLabel={t("viewInProjects")}
      />
    );
  };

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground position="top-0 right-0" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />
        <p className="reveal text-muted-foreground mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid gap-[clamp(1.25rem,3vw,2.25rem)]">
          {featuredProject && renderProjectCard(featuredProject, true)}
          <div className="grid gap-[clamp(1rem,2.5vw,1.75rem)] md:grid-cols-2">
            {supportingProjects.map((project) => renderProjectCard(project, false))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 reveal">
          <Button href="/projects" variant="outline" className="px-8 py-3.5 rounded-xl text-sm gap-2">
            <ArrowRightShortIcon className="w-4 h-4" />
            {t("viewAll")}
          </Button>
          <Button href="/#contact" variant="primary" className="px-8 py-3.5 rounded-xl text-sm gap-2">
            {t("letsTalk")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

