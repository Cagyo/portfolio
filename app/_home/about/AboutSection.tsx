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
import styles from "./AboutSection.module.css";

function getCompanyLogo(company: string): React.ReactNode {
  switch (company) {
    case "All Square":
      return (
        <div className={styles.companyLogo}>
          <Image src="/assets/companies/allsquare.jpg" alt="All Square" width={36} height={36} className={styles.companyLogoImage} />
        </div>
      )
    case "Avocado Technology":
      return (
        <div className={styles.companyLogo}>
          <Image src="/assets/companies/avocado_tech_logo.jpg" alt="Avocado Technology" width={36} height={36} className={styles.companyLogoImage} />
        </div>
      )
    case "EngagePoint, Inc.":
      return (
        <div className={styles.companyLogo}>
          <Image src="/assets/companies/engagepoint.jpg" alt="EngagePoint" width={36} height={36} className={styles.companyLogoImage} />
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
    <section id="about" className={styles.section}>
      <BlobBackground position="-top-32 -right-32" opacity={0.1} />

      <div className={styles.inner}>
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className={styles.layout}>
          <div className={`reveal ${styles.narrative}`}>
            <div className={styles.copyBlock}>
              <p className={styles.lead}>
                {t.rich("bio1", {
                  highlight: (chunks) => (
                    <span className={styles.highlight}>{chunks}</span>
                  ),
                })}
              </p>
              <p className={styles.body}>
                {t.rich("bio2", {
                  highlight: (chunks) => (
                    <span className={styles.highlight}>{chunks}</span>
                  ),
                })}
              </p>
              <p className={styles.body}>{t("bio3")}</p>
            </div>
            <InfoGrid />
            <SocialLinks />
          </div>

          <aside className={`reveal ${styles.experienceRail}`} aria-labelledby="about-experience-heading">
            <div className={styles.experienceHeader}>
              <h3 id="about-experience-heading" className={styles.experienceHeading}>{t("experienceHeading")}</h3>
              <span className={styles.experienceRule} aria-hidden="true" />
            </div>
            <ExperienceList initialSlice={initialSlice} extraSlice={extraSlice} hiddenCount={hiddenCount} />
          </aside>
        </div>

        {/* <BusinessImpact /> */}
      </div>
    </section>
  );
}
