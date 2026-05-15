import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./HeroSection.module.css";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { EnvelopeIcon } from "@/assets/icons/EnvelopeIcon";
import { Button } from "@/app/_components/button/Button";
import { ScrollIndicator } from "@/app/_components/ScrollIndicator";
import { getHeroLogoProjects } from "@/app/_data/projects/get-hero-logo-projects";
import { getProjects } from "@/app/_data/projects/get-projects";
import { HeroLogos } from "./HeroLogos";
import { HeroSkillChips } from "./HeroSkillChips";
import { PhotoCard } from "./PhotoCard";
import { TestimonialSnippet, type SnippetTestimonial } from "@/app/_home/recommendations/TestimonialSnippet";

export async function HeroSection() {
  const [t, tRecs, allProjects] = await Promise.all([
    getTranslations("hero"),
    getTranslations("recommendations"),
    getProjects(),
  ]);
  const heroLogos = getHeroLogoProjects(allProjects);
  const recItems = tRecs.raw("items") as SnippetTestimonial[];
  const firstRec = recItems[0];

  return (
    <section id="hero" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.copyColumn}>
          <div
            className={styles.mobilePhotoFrame}
          >
            <Image
              src="/assets/photo/main_photo.jpg"
              alt={t("photoAlt")}
              fill
              className="object-cover object-[50%_20%]"
              sizes="(max-width: 639px) calc(100vw - 2rem), 128px"
              priority
            />
          </div>

          <div className={styles.identityRow}>
            <div className={styles.nameBlock}>
              <h1 className={styles.heading}>
                {t("firstName")}
                <br />
                <span className={styles.lastName}>{t("lastName")}</span>
                <span className="sr-only"> — {t("h1Role")}</span>
              </h1>
              <p className={styles.tagline}>
                {t.rich("tagline", {
                  role: (chunks) => <span className={styles.taglineRole}>{chunks}</span>,
                  emphasis: (chunks) => <span className={styles.taglineEmphasis}>{chunks}</span>,
                })}
              </p>
            </div>
            <div className={styles.tabletPhotoFrame}>
              <Image
                src="/assets/photo/main_photo.jpg"
                alt={t("photoAlt")}
                fill
                className="object-cover object-[50%_20%]"
                sizes="128px"
                priority
              />
            </div>
          </div>

          <p className={styles.description}>
            {t("description")}
          </p>

          <div className={styles.ctaRow}>
            <Button href="#projects" className={styles.primaryCta}>
              {t("ctaWork")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <Button href="#contact" variant="outline" className={styles.secondaryCta}>
              <EnvelopeIcon className="w-4 h-4" />
              {t("ctaContact")}
            </Button>
          </div>

          <div className={styles.mobileSkills}>
            <HeroSkillChips />
          </div>

          <HeroLogos label={t("logosLabel")} logos={heroLogos} />

          {/* Mobile testimonial snippet — mirrors the floating card on desktop */}
          {firstRec && (
            <TestimonialSnippet
              testimonial={firstRec}
              size="md"
              className={styles.mobileTestimonial}
            />
          )}
        </div>

        <div className={styles.visualColumn}>
          <PhotoCard
            availableLabel={t("badge")}
            testimonial={firstRec}
          />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
