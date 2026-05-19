import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteConfig } from "@/app/_config/site-config";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
// import { BusinessImpact } from "./BusinessImpact";
import { ExperienceCard } from "./ExperienceCard";
import { ExperienceList } from "./ExperienceList";
import { InfoGrid } from "./InfoGrid";
import { SocialLinks } from "./SocialLinks";

function getCompanyLogo(company: string): React.ReactNode {
  switch (company) {
    case "All Square":
      return (
        <div className="w-9 h-9 flex-shrink-0 overflow-hidden rounded-xl border border-border">
          <Image src="/assets/companies/allsquare.jpg" alt="All Square" width={36} height={36} className="w-full h-full object-cover" />
        </div>
      )
    case "Avocado Technology":
      return (
        <div className="w-9 h-9 flex-shrink-0 overflow-hidden rounded-xl border border-border">
          <Image src="/assets/companies/avocado_tech_logo.jpg" alt="Avocado Technology" width={36} height={36} className="w-full h-full object-cover" />
        </div>
      )
    case "EngagePoint, Inc.":
      return (
        <div className="w-9 h-9 flex-shrink-0 overflow-hidden rounded-xl border border-border">
          <Image src="/assets/companies/engagepoint.jpg" alt="EngagePoint" width={36} height={36} className="w-full h-full object-cover" />
        </div>
      )
    default:
      return undefined
  }
}

type AboutSectionProps = { sectionNumber?: string }

export async function AboutSection({ sectionNumber }: AboutSectionProps) {
  const t = await getTranslations("about");

  const items = t.raw("experience") as {
    company: string
    period: string
    tags: string[]
    positions: { title: string; period: string; description: string }[]
  }[]

  const accentOpacities = ["1", "0.7", "0.45", "0.25"]

  const initialSlice = items.slice(0, siteConfig.ui.experienceInitialVisible).map((experienceItem, experienceIndex) => (
    <ExperienceCard
      key={experienceItem.company}
      company={experienceItem.company}
      period={experienceItem.period}
      tags={experienceItem.tags}
      positions={experienceItem.positions}
      logo={getCompanyLogo(experienceItem.company)}
      accentOpacity={accentOpacities[experienceIndex] ?? "0.25"}
      projectsHref={`/projects?company=${encodeURIComponent(experienceItem.company)}`}
    />
  ))

  const extraSlice = items.slice(siteConfig.ui.experienceInitialVisible).map((experienceItem, experienceIndex) => (
    <ExperienceCard
      key={experienceItem.company}
      company={experienceItem.company}
      period={experienceItem.period}
      tags={experienceItem.tags}
      positions={experienceItem.positions}
      logo={getCompanyLogo(experienceItem.company)}
      accentOpacity={accentOpacities[siteConfig.ui.experienceInitialVisible + experienceIndex] ?? "0.25"}
      projectsHref={`/projects?company=${encodeURIComponent(experienceItem.company)}`}
    />
  ))

  const hiddenCount = Math.max(0, items.length - siteConfig.ui.experienceInitialVisible)

  return (
    <section id="about" className="relative overflow-hidden py-[clamp(4rem,7vw,6rem)]">
      <BlobBackground position="-top-32 -right-32" opacity={0.1} />

      <div className="w-full max-w-[72rem] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className="grid items-start gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)] lg:gap-[clamp(3rem,5vw,5.5rem)]">
          <div className="reveal grid gap-[clamp(1.25rem,2vw,1.75rem)] max-w-[48rem]">
            <div className="grid gap-[1.1rem] max-w-[68ch]">
              <p className="m-0 max-w-[62ch] text-foreground-soft text-lg lg:text-[1.1875rem] leading-[1.75] break-words">
                {t.rich("bio1", {
                  highlight: (chunks) => (
                    <span className="text-amber-light font-[650] [html[data-theme=light]_&]:text-amber-dark">{chunks}</span>
                  ),
                })}
              </p>
              <p className="m-0 text-muted-foreground leading-[1.82] break-words">
                {t.rich("bio2", {
                  highlight: (chunks) => (
                    <span className="text-amber-light font-[650] [html[data-theme=light]_&]:text-amber-dark">{chunks}</span>
                  ),
                })}
              </p>
              <p className="m-0 text-muted-foreground leading-[1.82] break-words">{t("bio3")}</p>
            </div>
            <InfoGrid />
            <SocialLinks />
          </div>

          <aside className="reveal [transition-delay:0.15s]" aria-labelledby="about-experience-heading">
            <div className="flex items-center gap-4 mb-5">
              <h3 id="about-experience-heading" className="m-0 text-faint-foreground text-xs font-bold tracking-normal uppercase whitespace-nowrap">{t("experienceHeading")}</h3>
              <span className="flex-1 h-px bg-[linear-gradient(to_right,color-mix(in_srgb,var(--amber)_32%,transparent),transparent)]" aria-hidden="true" />
            </div>
            <ExperienceList initialSlice={initialSlice} extraSlice={extraSlice} hiddenCount={hiddenCount} />
          </aside>
        </div>

        {/* <BusinessImpact /> */}
      </div>
    </section>
  );
}
