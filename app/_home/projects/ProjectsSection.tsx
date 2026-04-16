import { getTranslations } from "next-intl/server";
import { PROJECTS, getProjectTitle, overlayTypeFor } from "../../_data/projects-data";
import { HOME_PROJECT_IDS, getHomeProjectVisual } from "../../_data/home-project-visuals";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";
import { Button } from "../../_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { ProjectLinkOverlay } from "./ProjectLinkOverlay";

export async function ProjectsSection() {
  const t = await getTranslations("projects");

  const projects = HOME_PROJECT_IDS.map((id) => PROJECTS.find((project) => project.id === id)!)

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />
        <p className="reveal text-white/50 mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const visuals = getHomeProjectVisual(project.id);

            return (
              <ProjectCard
                key={project.id}
                title={getProjectTitle(project)}
                description={project.description}
                meta={{ category: project.industry, role: project.role, year: project.year }}
                badge={{ icon: visuals?.icon, label: project.badgeLabel ?? '' }}
                tags={project.stackFilters}
                imageBg={project.imageBg ?? ''}
                imageContent={visuals?.imageContent}
                linkOverlay={
                  <ProjectLinkOverlay
                    overlayType={overlayTypeFor(project.link)}
                    link={project.link}
                  />
                }
                featured={project.featured}
                viewInProjectsHref={`/projects#project-${project.id}`}
                viewInProjectsLabel={t("viewInProjects")}
              />
            );
          })}
        </div>

        <div className="text-center mt-12 reveal">
          <Button href="/projects" variant="outline" className="px-8 py-3.5 rounded-xl text-sm gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}

