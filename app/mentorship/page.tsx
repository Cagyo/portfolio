import { getTranslations } from "next-intl/server";
import { Nav } from "@/app/_components/nav/Nav";
import { RevealProvider } from "@/app/_home/RevealProvider";
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

  const links = [
    { label: t("portfolio"), href: "/" },
    { label: t("programs"), href: "#plans" },
    { label: t("whoItsFor"), href: "#fit" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <RevealProvider />
      <Nav links={links} ctaHref="/#contact" ctaLabel={t("cta")} />
      <MentorshipHero />
      <StackSection />
      <TracksSection />
      <MentorshipFit />
      <ApplySection />
      <MentorshipFooter />
    </div>
  );
}
