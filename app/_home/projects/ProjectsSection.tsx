import { getTranslations } from "next-intl/server";
import { PROJECTS, getProjectTitle, overlayTypeFor } from "@/app/_data/projects-data";
import { HOME_PROJECT_IDS, getHomeProjectVisual } from "@/app/_data/home-project-visuals";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { Button } from "@/app/_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { ProjectLinkOverlay } from "./ProjectLinkOverlay";
import { AnonymizedImageContent } from "./AnonymizedImageContent";

type HomeCard = {
  id: number
  problem: string
  outcome: string[]
  buyerBadge: string
}

type ProjectsSectionProps = { sectionNumber?: string }

export async function ProjectsSection({ sectionNumber }: ProjectsSectionProps) {
  const t = await getTranslations("projects");

  const homeCards = t.raw("homeCards") as HomeCard[]
  const projects = HOME_PROJECT_IDS.map((id) => PROJECTS.find((project) => project.id === id)!)

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
            const card = homeCards.find((hc) => hc.id === project.id);

            return (
              <ProjectCard
                key={project.id}
                title={getProjectTitle(project)}
                description={project.description}
                problem={card?.problem}
                outcome={card?.outcome}
                meta={{ category: project.industry, role: project.role, year: project.year }}
                badge={{ icon: visuals?.icon, label: card?.buyerBadge ?? project.badgeLabel ?? '' }}
                tags={project.stackFilters}
                imageBg={project.imageBg ?? ''}
                imageContent={
                  <>
                    {visuals?.imageContent}
                    {project.anonymizedImage && <AnonymizedImageContent src={project.anonymizedImage} />}
                  </>
                }
                linkOverlay={
                  <ProjectLinkOverlay
                    overlayType={overlayTypeFor(project.link)}
                    link={project.link}
                    anonymizedImage={project.anonymizedImage}
                  />
                }
                featured={project.featured}
                viewInProjectsHref={`/projects#project-${project.id}`}
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

