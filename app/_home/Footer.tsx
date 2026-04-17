import { getTranslations } from "next-intl/server";
// import { SparkleIcon } from "@/assets/icons/SparkleIcon";
import { GitHubLogo } from "@/assets/logos/GitHubLogo";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import { XLogo } from "@/assets/logos/XLogo";
import { siteConfig } from "@/app/_config/site-config";
// import styles from "./Footer.module.css";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-sm">
          {t("copyright")}{" "}
          <span className="text-gradient font-semibold">{t("author")}</span>. {t("crafted")}
          {/* <span className="text-white/15 mx-1.5">&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide ${styles.statusBadge}`}
            >
              <SparkleIcon className="w-3 h-3 flex-shrink-0" />
              {t("builtWithAI")}
            </span>
          </span> */}
        </p>
        <div className="flex items-center gap-6">
          <a href="#hero" className="text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer">
            {t("backToTop")}
          </a>
          <div className="flex gap-3">
            <a
              href={siteConfig.social.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("githubAriaLabel")}
              className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <GitHubLogo className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("linkedinAriaLabel")}
              className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <LinkedInLogo className="w-4 h-4" />
            </a>
            {siteConfig.social.twitter.url && (
              <a
                href={siteConfig.social.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("twitterAriaLabel")}
                className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <XLogo className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
