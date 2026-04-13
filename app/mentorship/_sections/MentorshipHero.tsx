import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { CalendarIcon } from "../../../assets/icons/CalendarIcon";
import { BlobBackground } from "../../_components/BlobBackground";
import { Button } from "../../_components/button/Button";
import { siteConfig } from "../../_config/site-config";
import styles from "./MentorshipHero.module.css";

type HeroStat = { value: string; label: string }

export async function MentorshipHero() {
  const t = await getTranslations("mentorshipPage.hero");
  const stats = t.raw("stats") as HeroStat[];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-24"
    >
      <BlobBackground size="w-96 h-96" color="bg-violet-700" position="top-20 -left-32" opacity={0.15} />
      <BlobBackground size="w-80 h-80" color="bg-violet-500" position="bottom-20 -right-24" opacity={0.1} />
      <BlobBackground size="w-64 h-64" color="bg-violet-800" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" opacity={0.08} />

      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Badge */}
        <div
          className={`reveal inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 ${styles.badge}`}
        >
          <span className={`w-2 h-2 rounded-full animate-pulse-slow ${styles.badgeDot}`} />
          <span className={`text-sm font-medium ${styles.badgeLabel}`}>{t("badge")}</span>
        </div>

        {/* Headline */}
        <h1
          className={`reveal font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight mb-6 ${styles.delay1}`}
        >
          {t("headline1")}<br />
          {t("headline2")}<br />
          <span className="text-gradient">{t("headlineGradient")}</span>
        </h1>

        {/* Subhead */}
        <p
          className={`reveal text-white/55 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 ${styles.delay2}`}
        >
          {t("subhead")}
        </p>

        {/* Stats */}
        <div
          className={`reveal flex flex-wrap justify-center gap-8 sm:gap-14 mb-12 ${styles.delay3}`}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 sm:gap-14">
              {i > 0 && <div className="w-px h-8 bg-white/10 hidden sm:block" />}
              <div className="text-center">
                <p className="font-heading font-black text-3xl text-gradient">{stat.value}</p>
                <p className="text-white/40 text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          className={`reveal flex flex-wrap justify-center gap-4 ${styles.delay4}`}
        >
          <Button
            href="#plans"
            className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2"
          >
            {t("ctaPrograms")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
          <a
            href={siteConfig.calendly.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-violet-400/50 text-violet-400 hover:bg-violet-400/10 hover:border-violet-400 hover:-translate-y-0.5 transition-all duration-200 px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2 font-semibold"
          >
            <CalendarIcon className="w-4 h-4" />
            {t("ctaCall")}
          </a>
        </div>
      </div>

      {/* Scroll indicator — violet variant */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-violet-500/60 to-transparent" />
      </div>
    </section>
  );
}
