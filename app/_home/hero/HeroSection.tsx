import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./HeroSection.module.css";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { EnvelopeIcon } from "@/assets/icons/EnvelopeIcon";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { Button } from "@/app/_components/button/Button";
import { ScrollIndicator } from "@/app/_components/ScrollIndicator";
import { StatRow } from "@/app/_components/StatRow";
import { PhotoCard } from "./PhotoCard";
import { TestimonialSnippet, type SnippetTestimonial } from "@/app/_home/recommendations/TestimonialSnippet";

export async function HeroSection() {
  const [t, tRecs] = await Promise.all([
    getTranslations("hero"),
    getTranslations("recommendations"),
  ]);
  const stats = t.raw("stats") as { value: string; label: string }[];
  const recItems = tRecs.raw("items") as SnippetTestimonial[];
  const firstRec = recItems[0];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-24">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-20 -left-32" />
      <BlobBackground size="w-80 h-80" color="bg-amber-400" position="bottom-20 -right-24" opacity={0.1} />
      <BlobBackground size="w-64 h-64" color="bg-amber-600" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" opacity={0.08} />

      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div className="space-y-8">
          {/* Small mobile: full-width photo */}
          <div
            className={`block sm:hidden w-full rounded-2xl relative overflow-hidden ${styles.profileFrame}`}
          >
            <Image
              src="/assets/photo/main_photo.jpg"
              alt={t("photoAlt")}
              fill
              className="object-cover object-[50%_20%]"
              sizes="100vw"
              priority
            />
          </div>

          {/* <PulseBadge>{t("badge")}</PulseBadge> */}

          {/* Name & role */}
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-4">
              <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
                {t("firstName")}
                <br />
                <span className="text-gradient">{t("lastName")}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/60 font-normal">
                {t.rich("tagline", {
                  role: (chunks) => <span className="text-white/80">{chunks}</span>,
                  emphasis: (chunks) => <span className="text-amber-400 font-medium">{chunks}</span>,
                })}
              </p>
            </div>
            {/* Medium mobile photo */}
            <div className="flex-shrink-0 hidden sm:block lg:hidden">
              <div
                className={`w-32 h-32 rounded-2xl relative overflow-hidden border border-amber-500/30 ${styles.cardGlow}`}
              >
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
          </div>

          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="#projects" className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2">
              {t("ctaWork")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <Button href="#contact" variant="outline" className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              {t("ctaContact")}
            </Button>
          </div>

          <StatRow stats={stats} />

          {/* Mobile testimonial snippet — mirrors the floating card on desktop */}
          {firstRec && (
            <TestimonialSnippet
              testimonial={firstRec}
              size="md"
              className="block lg:hidden"
            />
          )}
        </div>

        {/* Visual — photo card */}
        <div className="relative hidden lg:flex items-center justify-center">
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
