import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { CalendarIcon } from "../../../assets/icons/CalendarIcon";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { BlobBackground } from "../../_components/BlobBackground";
import { Button } from "../../_components/button/Button";
import { siteConfig } from "../../_config/site-config";
import styles from "./ApplySection.module.css";

export async function ApplySection() {
  const t = await getTranslations("mentorshipPage.apply");

  return (
    <section id="apply" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-violet-700" position="-bottom-32 left-1/2 -translate-x-1/2" opacity={0.1} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="reveal mb-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${styles.badge}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse-slow ${styles.badgeDot}`} />
            <span className={`text-sm font-medium ${styles.badgeLabel}`}>{t("badge")}</span>
          </span>
        </div>

        <h2
          className={`reveal font-heading font-black text-4xl sm:text-5xl text-white mb-6 ${styles.delay1}`}
        >
          {t("headline1")}<br />
          <span className="text-gradient">{t("headlineGradient")}</span>
        </h2>

        <p
          className={`reveal text-white/50 text-lg leading-relaxed mb-10 ${styles.delay2}`}
        >
          {t("body")}
        </p>

        <div
          className={`reveal flex flex-col sm:flex-row items-center justify-center gap-4 ${styles.delay3}`}
        >
          {/* Calendly card */}
          <a
            href={siteConfig.calendly.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 glass rounded-2xl p-4 hover:border-violet-500/40 transition-all duration-200 cursor-pointer w-full sm:w-auto"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 ${styles.calendlyBtn}`}
            >
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{t("calendlyLabel")}</p>
              <p className="text-white/35 text-xs mt-0.5">{t("calendlyMeta")}</p>
            </div>
            <ExternalLinkIcon className="w-4 h-4 text-white/25 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 ml-2" />
          </a>

          <span className="text-white/20 text-sm hidden sm:block">{t("or")}</span>

          <Button href="/#contact" className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2">
            {t("messageCta")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
