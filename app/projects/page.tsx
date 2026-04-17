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
      <BlobBackground size="w-[500px] h-[500px]" color="bg-amber-500" position="-top-24 -right-24" opacity={0.08} />
      <BlobBackground size="w-[400px] h-[400px]" color="bg-amber-600" position="bottom-0 -left-20" opacity={0.08} />
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <ProjectsPage />
      </Suspense>
    </div>
  );
}
