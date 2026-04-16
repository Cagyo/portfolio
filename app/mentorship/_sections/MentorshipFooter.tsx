import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";

export async function MentorshipFooter() {
  const t = await getTranslations("mentorshipPage.footer");

  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-sm">
          {t("copyright")} <span className="text-gradient font-semibold">{t("author")}</span>. {t("suffix")}
        </p>
        <Link
          href="/"
          className="text-white/30 hover:text-violet-400 text-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          {t("backToPortfolio")}
        </Link>
      </div>
    </footer>
  );
}
