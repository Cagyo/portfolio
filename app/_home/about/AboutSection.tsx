import { getTranslations } from "next-intl/server";
import { StripeLogo } from "../../../assets/logos/StripeLogo";
import { VercelLogo } from "../../../assets/logos/VercelLogo";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { BusinessImpact } from "./BusinessImpact";
import { ExperienceCard } from "./ExperienceCard";
import { InfoGrid } from "./InfoGrid";
import { SocialLinks } from "./SocialLinks";
import styles from "./AboutSection.module.css";

// Companies with known logos — anything not listed here gets the monogram fallback
const COMPANY_LOGOS: Record<string, React.ReactNode> = {
  Stripe: (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.stripeIcon}`}>
      <StripeLogo className="w-5 h-5" />
    </div>
  ),
  Vercel: (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black border border-white/10">
      <VercelLogo className="w-4 h-4" />
    </div>
  ),
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
          <div className={`lg:col-span-2 reveal space-y-4 ${styles.bioContent}`}>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-6">{t("experienceHeading")}</h3>
            {(t.raw("experience") as { title: string; company: string; period: string; description: string; tags: string[] }[]).map(
              (exp, i) => (
                <ExperienceCard
                  key={exp.company}
                  title={exp.title}
                  company={exp.company}
                  period={exp.period}
                  description={exp.description}
                  tags={exp.tags}
                  logo={COMPANY_LOGOS[exp.company]}
                  accentOpacity={["1", "0.6", "0.3"][i]}
                  projectsHref={`/projects?company=${encodeURIComponent(exp.company)}`}
                />
              )
            )}
          </div>
        </div>

        <BusinessImpact />
      </div>
    </section>
  );
}
