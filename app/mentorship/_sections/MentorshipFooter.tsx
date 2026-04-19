import { getTranslations } from "next-intl/server";

export async function MentorshipFooter() {
  const t = await getTranslations("mentorshipPage.footer");

  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-white/30 text-sm">
          {t("copyright")} <span className="text-gradient font-semibold">{t("author")}</span>. {t("suffix")}
        </p>
      </div>
    </footer>
  );
}
