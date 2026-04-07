"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "../../_config/site-config";
import { DownloadIcon } from "../../../assets/icons/DownloadIcon";
import { GitHubLogo } from "../../../assets/logos/GitHubLogo";
import { LinkedInLogo } from "../../../assets/logos/LinkedInLogo";
import { XLogo } from "../../../assets/logos/XLogo";

export function SocialLinks() {
  const t = useTranslations("common");

  return (
    <div className="flex gap-4 pt-2">
      <a
        href={siteConfig.social.github.url}
        aria-label={t("githubProfile")}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <GitHubLogo className="w-5 h-5" />
      </a>
      <a
        href={siteConfig.social.linkedin.url}
        aria-label={t("linkedinProfile")}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <LinkedInLogo className="w-5 h-5" />
      </a>
      <a
        href={siteConfig.social.twitter.url}
        aria-label={t("twitterProfile")}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <XLogo className="w-5 h-5" />
      </a>
      <a
        href={siteConfig.resume.url}
        aria-label={t("downloadResume")}
        className="btn-outline px-4 py-2 rounded-xl text-sm cursor-pointer inline-flex items-center gap-2"
      >
        <DownloadIcon className="w-4 h-4" />
        {t("resume")}
      </a>
    </div>
  );
}
