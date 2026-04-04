import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./HeroSection.module.css";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { EnvelopeIcon } from "../../../assets/icons/EnvelopeIcon";
import { BlobBackground } from "../../_components/BlobBackground";
import { Button } from "../../_components/button/Button";
import { PulseBadge } from "../../_components/PulseBadge";
import { ScrollIndicator } from "../../_components/ScrollIndicator";
import { StatRow } from "../../_components/StatRow";
import { PhotoCard } from "./PhotoCard";
import { Typewriter } from "./Typewriter";

export async function HeroSection() {
  const [t, tRecs] = await Promise.all([
    getTranslations("hero"),
    getTranslations("recommendations"),
  ]);
  const stats = t.raw("stats") as { value: string; label: string }[];
  const typewriterRoles = t.raw("typewriterRoles") as string[];
  const recItems = tRecs.raw("items") as {
    quotePreview: string;
    authorName: string;
    authorRole: string;
    authorInitials: string;
    authorPhoto?: string;
  }[];
  const firstRec = recItems[0];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-24">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-20 -left-32" delay="0s" />
      <BlobBackground size="w-80 h-80" color="bg-amber-400" position="bottom-20 -right-24" delay="3s" opacity="0.1" />
      <BlobBackground size="w-64 h-64" color="bg-amber-600" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay="1.5s" opacity="0.08" />

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
              <p className="text-xl sm:text-2xl text-white/60 font-light">
                {t("tagline")} <Typewriter roles={typewriterRoles} />
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
            <a
              href="#recommendations"
              className="block lg:hidden glass rounded-2xl p-4 hover:border-amber-500/20 transition-colors duration-200 cursor-pointer"
            >
              <p className="text-white/65 text-sm leading-relaxed italic line-clamp-2 mb-3">
                &ldquo;{firstRec.quotePreview}&rdquo;
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {firstRec.authorPhoto ? (
                    <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={firstRec.authorPhoto}
                        alt={firstRec.authorName}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[10px] font-black text-black flex-shrink-0">
                      {firstRec.authorInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white/60 text-xs font-semibold leading-none truncate">{firstRec.authorName}</p>
                    <p className="text-white/35 text-[10px] mt-0.5 leading-none truncate">{firstRec.authorRole.split("·")[1]?.trim()}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <svg key={index} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </a>
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
