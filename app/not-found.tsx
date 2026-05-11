import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRightShortIcon } from "@/assets/icons/ArrowRightShortIcon";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="text-7xl font-heading font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold text-white mb-3">
          {t("title")}
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          {t("body")}
        </p>
        <Link
          href="/"
          className={`inline-flex items-center gap-2 transition-colors font-medium ${styles.homeLink}`}
        >
          <ArrowRightShortIcon className="w-4 h-4" />
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
