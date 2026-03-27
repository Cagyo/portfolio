import { DownloadIcon } from "../../assets/icons/DownloadIcon";
import { GitHubLogo } from "../../assets/logos/GitHubLogo";
import { LinkedInLogo } from "../../assets/logos/LinkedInLogo";
import { XLogo } from "../../assets/logos/XLogo";

export function SocialLinks() {
  return (
    <div className="flex gap-4 pt-2">
      <a
        href="#"
        aria-label="GitHub profile"
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <GitHubLogo className="w-5 h-5" />
      </a>
      <a
        href="#"
        aria-label="LinkedIn profile"
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <LinkedInLogo className="w-5 h-5" />
      </a>
      <a
        href="#"
        aria-label="Twitter profile"
        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer"
      >
        <XLogo className="w-5 h-5" />
      </a>
      <a
        href="#"
        aria-label="Download resume"
        className="btn-outline px-4 py-2 rounded-xl text-sm cursor-pointer inline-flex items-center gap-2"
      >
        <DownloadIcon className="w-4 h-4" />
        Resume
      </a>
    </div>
  );
}
