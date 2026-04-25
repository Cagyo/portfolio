import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { getProjects } from "@/app/_data/projects/get-projects";
import { JsonLd } from "@/app/_schema/JsonLd";
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb";
import { buildProjectsItemListSchema } from "@/app/_schema/item-list";
import { ProjectsPage } from "./_components/ProjectsPage";

export async function generateMetadata() {
  const t = await getTranslations("projectsPage");
  return {
    title: `${t("title")} — Oleksii Berliziev`,
  };
}

export default async function Page() {
  const projects = await getProjects();
  const t = await getTranslations("projectsPage");
  const itemListSchema = buildProjectsItemListSchema(projects);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: t("title"), path: "/projects" },
  ]);
  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity={0.1} />
      <BlobBackground size="w-96 h-96" color="bg-amber-600" position="-bottom-32 left-1/4" opacity={0.1} />
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <ProjectsPage projects={projects} />
      </Suspense>
    </div>
  );
}
