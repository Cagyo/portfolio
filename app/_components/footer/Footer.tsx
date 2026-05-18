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
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <nav
          aria-label={t("navAriaLabel")}
          className={styles.nav}
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.footerLink}
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className={styles.meta}>
          <div className={styles.copy}>
            <p className={styles.copyLine}>
              {t("copyright")} {" "}
              <span className={styles.author}>{t("author")}</span>. {t("crafted")}
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
          <div className={styles.actions}>
            <BackToTopLink label={t("backToTop")} className={styles.actionLink} />
            <CookieSettingsLink className={styles.actionLink} />
            <div className={styles.socials}>
              <TrackedLink
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("githubAriaLabel")}
                tracking={{ action: "outbound", target: "github" }}
                className={styles.socialLink}
              >
                <GitHubLogo className="w-4 h-4" />
              </TrackedLink>
              <TrackedLink
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("linkedinAriaLabel")}
                tracking={{ action: "outbound", target: "linkedin" }}
                className={styles.socialLink}
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
                  className={styles.socialLink}
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