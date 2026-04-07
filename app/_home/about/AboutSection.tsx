import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { BusinessImpact } from "./BusinessImpact";
import { ExperienceCard } from "./ExperienceCard";
import { ExperienceList } from "./ExperienceList";
import { InfoGrid } from "./InfoGrid";
import { SocialLinks } from "./SocialLinks";
import styles from "./AboutSection.module.css";

// Companies with known logos — anything not listed here gets the monogram fallback
const COMPANY_LOGOS: Record<string, React.ReactNode> = {
  "All Square": (
    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
      <Image src="/assets/companies/allsquare.jpg" alt="All Square" width={36} height={36} className="w-full h-full object-cover" />
    </div>
  ),
  "Avocado Technology": (
    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
      <Image src="/assets/companies/avocado_tech_logo.jpg" alt="Avocado Technology" width={36} height={36} className="w-full h-full object-cover" />
    </div>
  ),
  "EngagePoint, Inc.": (
    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
      <Image src="/assets/companies/engagepoint.jpg" alt="EngagePoint" width={36} height={36} className="w-full h-full object-cover" />
    </div>
  ),
  // Geonix Company — no image, monogram fallback used automatically
};

export async function AboutSection() {
  const t = await getTranslations("about");

  return (
    <section id="about" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="-top-32 -right-32" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Text content */}
          <div className="lg:col-span-3 reveal space-y-6">
            <p className="text-white/70 text-lg leading-relaxed">
              {t.rich("bio1", {
                highlight: (chunks) => (
                  <span className="text-amber-400 font-semibold">{chunks}</span>
                ),
              })}
            </p>
            <p className="text-white/60 leading-relaxed">{t("bio2")}</p>
            <p className="text-white/60 leading-relaxed">{t("bio3")}</p>
            <InfoGrid />
            <SocialLinks />
          </div>

          {/* Timeline */}
          <div className={`lg:col-span-2 reveal ${styles.bioContent}`}>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-6">{t("experienceHeading")}</h3>
            {(() => {
              const items = t.raw("experience") as {
                company: string
                period: string
                tags: string[]
                positions: { title: string; period: string; description: string }[]
              }[];
              return (
                <ExperienceList total={items.length}>
                  {items.map((exp, i) => (
                    <ExperienceCard
                      key={exp.company}
                      company={exp.company}
                      period={exp.period}
                      tags={exp.tags}
                      positions={exp.positions}
                      logo={COMPANY_LOGOS[exp.company]}
                      accentOpacity={["1", "0.7", "0.45", "0.25"][i]}
                      projectsHref={`/projects?company=${encodeURIComponent(exp.company)}`}
                    />
                  ))}
                </ExperienceList>
              );
            })()}
          </div>
        </div>

        <BusinessImpact />
      </div>
    </section>
  );
}
