import Link from "next/link";
import { useTranslations } from "next-intl";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";

export function ClosingCta() {
  const t = useTranslations("projectsPage");
  const tNav = useTranslations("nav");

  return (
    <div className="mt-12 glass rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <p className="text-white/40 text-xs mb-1">{t("closingEyebrow")}</p>
        <p className="font-heading font-bold text-white text-base sm:text-lg leading-snug">
          {t("closingHeadline")}
        </p>
      </div>
      <Link
        href="/#contact"
        className="btn-amber px-6 py-2.5 rounded-xl text-sm flex-shrink-0 cursor-pointer inline-flex items-center gap-2"
      >
        <span>{tNav("cta")}</span>
        <ExternalLinkIcon className="w-4 h-4 relative z-10" />
      </Link>
    </div>
  );
}
