import Link from "next/link";
import { getTranslations } from "next-intl/server";
// import { SparkleIcon } from "@/assets/icons/SparkleIcon";
import { GitHubLogo } from "@/assets/logos/GitHubLogo";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import { XLogo } from "@/assets/logos/XLogo";
import { CookieSettingsLink } from "@/app/_components/cookie-consent/CookieSettingsLink";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { siteConfig } from "@/app/_config/site-config";
import { BackToTopLink } from "./BackToTopLink";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/faq", key: "faq" },
  { href: "/privacy", key: "privacy" },
] as const;

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <nav
          aria-label={t("navAriaLabel")}
          className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/30 hover:text-amber-400 transition-colors"
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white/30 text-sm">
              {t("copyright")} {" "}
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
            <p className={styles.disclosure}>{t("analyticsDisclosure")}</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <BackToTopLink label={t("backToTop")} />
            <CookieSettingsLink className="text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer" />
            <div className="flex gap-3">
              <TrackedLink
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("githubAriaLabel")}
                tracking={{ action: "outbound", target: "github" }}
                className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <GitHubLogo className="w-4 h-4" />
              </TrackedLink>
              <TrackedLink
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("linkedinAriaLabel")}
                tracking={{ action: "outbound", target: "linkedin" }}
                className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <LinkedInLogo className="w-4 h-4" />
              </TrackedLink>
              {siteConfig.social.twitter.url && (
                <TrackedLink
                  href={siteConfig.social.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("twitterAriaLabel")}
                  tracking={{ action: "outbound", target: "twitter" }}
                  className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <XLogo className="w-4 h-4" />
                </TrackedLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}