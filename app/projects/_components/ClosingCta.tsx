import { useTranslations } from "next-intl";
import { Button } from "@/app/_components/button/Button";

export function ClosingCta() {
  const t = useTranslations("projectsPage");
  const tNav = useTranslations("nav");

  return (
    <div className="mt-12 glass rounded-2xl p-8 text-center">
      <p className="text-white/40 text-sm mb-2">{t("closingEyebrow")}</p>
      <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mb-6">
        {t("closingHeadline")}
      </h2>
      <Button href="/#contact" className="px-8 py-3 rounded-xl text-sm cursor-pointer">
        {tNav("cta")}
      </Button>
    </div>
  );
}
