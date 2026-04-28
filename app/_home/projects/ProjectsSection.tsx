import { getTranslations } from "next-intl/server";
import { getProjects } from "@/app/_data/projects/get-projects";
import { getProjectTitle, overlayTypeFor } from "@/app/_data/projects/types";
import { HOME_PROJECT_IDS, getHomeProjectVisual } from "@/app/_data/home-project-visuals";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { Button } from "@/app/_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { ProjectLinkOverlay } from "./ProjectLinkOverlay";
import { AnonymizedImageContent } from "./AnonymizedImageContent";

type ProjectsSectionProps = { sectionNumber?: string }

export async function ProjectsSection({ sectionNumber }: ProjectsSectionProps) {
  const t = await getTranslations("projects");

  const allProjects = await getProjects();
  const projects = HOME_PROJECT_IDS.map((id) => allProjects.find((project) => project.id === id)!)

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />
        <p className="reveal text-white/50 mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const visuals = getHomeProjectVisual(project.id);
            const homeCard = project.homeCard;
            const blurredSrc = project.screenshots?.find((s) => s.kind === "blurred")?.src;

            return (
              <ProjectCard
                key={project.id}
                title={getProjectTitle(project)}
                description={project.description}
                problem={homeCard?.problem}
                outcome={homeCard?.outcome}
                meta={{ category: project.industry, role: project.role, year: project.year }}
                badge={{ icon: visuals?.icon, label: homeCard?.buyerBadge ?? '' }}
                tags={project.stackFilters}
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
                featured={project.featured}
                viewInProjectsHref={`/projects/${project.slug}`}
                viewInProjectsLabel={t("viewInProjects")}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 reveal">
          <Button href="/projects" variant="outline" className="px-8 py-3.5 rounded-xl text-sm gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
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

