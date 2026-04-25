import { getTranslations } from "next-intl/server";
import { SubpageNav } from "@/app/_components/nav/SubpageNav";
import { RevealProvider } from "@/app/_home/RevealProvider";
import { JsonLd } from "@/app/_schema/JsonLd";
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb";
import { buildMentorshipServiceSchema } from "@/app/_schema/professional-service";
import { ApplySection } from "./_sections/ApplySection";
import { MentorshipFit } from "./_sections/MentorshipFit";
import { MentorshipFooter } from "./_sections/MentorshipFooter";
import { MentorshipHero } from "./_sections/MentorshipHero";
import { StackSection } from "./_sections/StackSection";
import { TracksSection } from "./_sections/TracksSection";

export async function generateMetadata() {
  const t = await getTranslations("mentorshipPage.metadata");
  return {
    title: `${t("title")} — Oleksii Berliziev`,
  };
}

export default async function Page() {
  const t = await getTranslations("mentorshipPage.nav");
  const tMeta = await getTranslations("mentorshipPage.metadata");
  const tHero = await getTranslations("mentorshipPage.hero");

  const sections = [
    { label: t("programs"), href: "#plans" },
    { label: t("whoItsFor"), href: "#fit" },
  ];

  const serviceSchema = buildMentorshipServiceSchema({
    name: tMeta("title"),
    description: tHero("subhead"),
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: tMeta("title"), path: "/mentorship" },
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <RevealProvider />
      <SubpageNav sections={sections} cta={{ href: "/#contact", label: t("cta") }} />
      <MentorshipHero />
      <StackSection />
      <TracksSection />
      <MentorshipFit />
      <ApplySection />
      <MentorshipFooter />
    </div>
  );
}
