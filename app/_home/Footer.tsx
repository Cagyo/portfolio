import { SparkleIcon } from "../../assets/icons/SparkleIcon";
import { GitHubLogo } from "../../assets/logos/GitHubLogo";
import { LinkedInLogo } from "../../assets/logos/LinkedInLogo";
import { XLogo } from "../../assets/logos/XLogo";

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-sm">
          &copy; 2026{" "}
          <span className="text-gradient font-semibold">Oleksii Berliziev</span>. Crafted with precision
          <span className="text-white/15 mx-1.5">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", color: "rgba(245,158,11,0.65)" }}
            >
              <SparkleIcon className="w-3 h-3 flex-shrink-0" />
              Built with AI
            </span>
          </span>
        </p>
        <div className="flex items-center gap-6">
          <a href="#hero" className="text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer">
            Back to top
          </a>
          <div className="flex gap-3">
            <a href="#" aria-label="GitHub" className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer">
              <GitHubLogo className="w-4 h-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer">
              <LinkedInLogo className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="text-white/30 hover:text-amber-400 transition-colors cursor-pointer">
              <XLogo className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
