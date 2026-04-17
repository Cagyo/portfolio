import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/app/_config/site-config";
import { Button } from "@/app/_components/button/Button";
import { DownloadIcon } from "@/assets/icons/DownloadIcon";
import { GitHubLogo } from "@/assets/logos/GitHubLogo";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import { XLogo } from "@/assets/logos/XLogo";

export async function SocialLinks() {
  const t = await getTranslations("common");

  return (
    <div className="flex gap-4 pt-2">
      <a
        href={siteConfig.social.github.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("githubProfile")}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <GitHubLogo className="w-5 h-5" />
      </a>
      <a
        href={siteConfig.social.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("linkedinProfile")}
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <LinkedInLogo className="w-5 h-5" />
      </a>
      {siteConfig.social.twitter.url && (
        <a
          href={siteConfig.social.twitter.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("twitterProfile")}
          className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
        >
          <XLogo className="w-5 h-5" />
        </a>
      )}
      <Button
        href={siteConfig.resume.url}
        aria-label={t("downloadResume")}
        variant="outline"
        className="px-4 py-2 rounded-xl text-sm gap-2"
        target="_blank"
      >
        <DownloadIcon className="w-4 h-4" />
        {t("resume")}
      </Button>
    </div>
  );
}
