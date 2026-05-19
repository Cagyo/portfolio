import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRightShortIcon } from "@/assets/icons/ArrowRightShortIcon";
import { siteConfig } from "@/app/_config/site-config";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return {
    title: `${t("title")} — ${siteConfig.author.name}`,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="text-7xl font-heading font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("body")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-medium text-amber-foreground transition-colors hover:text-[color-mix(in_srgb,var(--amber-light)_78%,var(--text-primary))] [html[data-theme=light]_&]:hover:text-[color-mix(in_srgb,var(--amber-dark)_80%,black)]"
        >
          <ArrowRightShortIcon className="w-4 h-4" />
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
