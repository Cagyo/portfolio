import { getTranslations } from "next-intl/server";
import { ArrowLeftIcon } from "../assets/icons/ArrowLeftIcon";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-heading font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold text-white mb-3">
          {t("title")}
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          {t("body")}
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t("backHome")}
        </a>
      </div>
    </main>
  );
}
