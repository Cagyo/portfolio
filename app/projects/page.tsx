import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { ProjectsPage } from "./_components/ProjectsPage";

export async function generateMetadata() {
  const t = await getTranslations("projectsPage");
  return {
    title: `${t("title")} — Oleksii Berliziev`,
  };
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity={0.1} />
      <BlobBackground size="w-96 h-96" color="bg-amber-600" position="-bottom-32 left-1/4" opacity={0.1} />
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <ProjectsPage />
      </Suspense>
    </div>
  );
}
