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

const FOOTER_LINKS = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/faq", key: "faq" },
  { href: "/privacy", key: "privacy" },
] as const;

const footerLinkClassName = "border-0 bg-transparent p-0 font-[inherit] text-faint-foreground transition-[color,border-color,background] duration-[180ms] ease-[ease] hover:text-[var(--tag-color)] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber";
const socialLinkClassName = "inline-flex size-7 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] bg-[color-mix(in_srgb,var(--text-primary)_4%,transparent)] text-faint-foreground transition-[color,border-color,background] duration-[180ms] ease-[ease] hover:border-[color-mix(in_srgb,var(--amber)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--amber)_8%,transparent)] hover:text-[var(--tag-color)] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="relative isolate border-t border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-secondary)_86%,var(--bg))_0%,var(--bg)_100%)] py-[clamp(1.75rem,2.8vw,2.75rem)] pb-[calc(clamp(2rem,3vw,3rem)_+_env(safe-area-inset-bottom))] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--amber)_28%,transparent)_50%,transparent_100%)] before:opacity-[0.42] [html[data-theme=light]_&]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-secondary)_72%,var(--bg))_0%,var(--bg)_100%)] [html[data-theme=light]_&]:before:opacity-[0.36]">
      <div className="mx-auto grid w-[min(calc(100%_-_2rem),72rem)] gap-[clamp(1.25rem,2vw,1.75rem)]">
        <nav
          aria-label={t("navAriaLabel")}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm sm:justify-start"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={footerLinkClassName}
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className="grid items-end gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-sm leading-[1.55] text-faint-foreground">
              {t("copyright")} {" "}
              <span className="font-bold text-[var(--tag-color)]">{t("author")}</span>. {t("crafted")}
            </p>
            <p className="mt-[0.35rem] max-w-[34rem] text-xs leading-normal text-ghost-foreground [html[data-theme=light]_&]:text-muted-foreground">{t("analyticsDisclosure")}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3.5 sm:justify-end">
            <BackToTopLink label={t("backToTop")} className={footerLinkClassName} />
            <CookieSettingsLink className={footerLinkClassName} />
            <div className="flex items-center gap-2.5">
              <TrackedLink
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("githubAriaLabel")}
                tracking={{ action: "outbound", target: "github" }}
                className={socialLinkClassName}
              >
                <GitHubLogo className="w-4 h-4" />
              </TrackedLink>
              <TrackedLink
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("linkedinAriaLabel")}
                tracking={{ action: "outbound", target: "linkedin" }}
                className={socialLinkClassName}
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
                  className={socialLinkClassName}
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