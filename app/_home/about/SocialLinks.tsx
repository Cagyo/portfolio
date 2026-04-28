import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/app/_config/site-config";
import { TrackedButtonLink } from "@/app/_components/button/TrackedButtonLink";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { DownloadIcon } from "@/assets/icons/DownloadIcon";
import { GitHubLogo } from "@/assets/logos/GitHubLogo";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import { XLogo } from "@/assets/logos/XLogo";

export async function SocialLinks() {
  const t = await getTranslations("common");

  return (
    <div className="flex gap-4 pt-2">
      <TrackedLink
        href={siteConfig.social.github.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("githubProfile")}
        tracking={{ action: "outbound", target: "github" }}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <GitHubLogo className="w-5 h-5" />
      </TrackedLink>
      <TrackedLink
        href={siteConfig.social.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("linkedinProfile")}
        tracking={{ action: "outbound", target: "linkedin" }}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <LinkedInLogo className="w-5 h-5" />
      </TrackedLink>
      {siteConfig.social.twitter.url && (
        <TrackedLink
          href={siteConfig.social.twitter.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("twitterProfile")}
          tracking={{ action: "outbound", target: "twitter" }}
          className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
        >
          <XLogo className="w-5 h-5" />
        </TrackedLink>
      )}
      <TrackedButtonLink
        href={siteConfig.resume.url}
        aria-label={t("downloadResume")}
        tracking={{ action: "resume" }}
        variant="outline"
        className="px-4 py-2 rounded-xl text-sm gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <DownloadIcon className="w-4 h-4" />
        {t("resume")}
      </TrackedButtonLink>
    </div>
  );
}
