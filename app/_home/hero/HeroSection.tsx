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
    <section
      id="hero"
      className={`${styles.section} relative min-h-svh flex items-center justify-center overflow-hidden isolate pt-28 pb-20 lg:min-h-[max(43rem,100svh)] lg:pt-[7.5rem] lg:pb-24`}
    >
      <div className="relative z-[1] w-full max-w-[72rem] mx-auto grid gap-[clamp(2.5rem,7vw,5rem)] items-center px-4 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-7 lg:gap-8">
          {/* Mobile photo — shown below 640 px */}
          <div className="relative block w-full aspect-[16/10] max-h-56 overflow-hidden border border-[color-mix(in_srgb,var(--amber)_18%,transparent)] rounded-2xl shadow-[0_18px_54px_color-mix(in_srgb,var(--amber)_10%,transparent)] sm:hidden">
            <Image
              src="/assets/photo/main_photo.jpg"
              alt={t("photoAlt")}
              fill
              className="object-cover object-[50%_20%]"
              sizes="(max-width: 639px) calc(100vw - 2rem), 128px"
              priority
            />
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="m-0 text-foreground font-heading text-[3.25rem] max-[399px]:text-[2.875rem] sm:text-[4rem] lg:text-[5.25rem] xl:text-[5.75rem] font-black tracking-normal leading-[0.92]">
                {t("firstName")}
                <br />
                <span className="text-amber-light [html[data-theme=light]_&]:text-[var(--tag-color)]">
                  {t("lastName")}
                </span>
                <span className="sr-only"> — {t("h1Role")}</span>
              </h1>
              <p className="max-w-[34rem] mt-4 mb-0 text-muted-foreground text-lg sm:text-[1.375rem] font-normal leading-[1.42]">
                {t.rich("tagline", {
                  role: (chunks) => <span className="text-foreground-soft">{chunks}</span>,
                  emphasis: (chunks) => (
                    <span className="text-amber-light font-semibold [html[data-theme=light]_&]:text-[var(--tag-color)]">
                      {chunks}
                    </span>
                  ),
                })}
              </p>
            </div>
            {/* Tablet avatar — shown 640–1023 px */}
            <div className="hidden sm:relative sm:block sm:w-32 sm:h-32 sm:shrink-0 sm:overflow-hidden sm:border sm:border-[color-mix(in_srgb,var(--amber)_22%,transparent)] sm:rounded-2xl sm:shadow-[0_18px_48px_color-mix(in_srgb,var(--amber)_12%,transparent)] lg:hidden">
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

          <p className="max-w-[32rem] m-0 text-muted-foreground text-[1.0625rem] leading-[1.7]">
            {t("description")}
          </p>

          <div className="flex flex-wrap items-center gap-3 max-[399px]:flex-col max-[399px]:items-stretch">
            <Button
              href="#projects"
              className="min-h-[3.25rem] px-6 rounded-[0.875rem] text-base gap-2 cursor-pointer whitespace-nowrap max-[399px]:w-full"
            >
              {t("ctaWork")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <Button
              href="#contact"
              variant="outline"
              className="min-h-12 px-5 rounded-[0.875rem] text-[0.9375rem] gap-2 cursor-pointer whitespace-nowrap max-[399px]:w-full"
            >
              <EnvelopeIcon className="w-4 h-4" />
              {t("ctaContact")}
            </Button>
          </div>

          {/* Skill chips — hidden on desktop (shown in PhotoCard visual column) */}
          <div className="block lg:hidden">
            <HeroSkillChips />
          </div>

          <HeroLogos label={t("logosLabel")} logos={heroLogos} />

          {/* Mobile testimonial snippet — mirrors the floating card on desktop */}
          {firstRec && (
            <TestimonialSnippet
              testimonial={firstRec}
              size="md"
              className="block lg:hidden"
            />
          )}
        </div>

        {/* Desktop visual column */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
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
