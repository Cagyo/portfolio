import { getTranslations } from "next-intl/server";
import { FitList } from "@/app/_components/fit-list/FitList";

export async function FitSection() {
  const t = await getTranslations("fit");
  const goodFit = (t.raw("goodFit") as string[]).map((text) => ({ text }));
  const notFit = (t.raw("notFit") as string[]).map((text) => ({ text }));

  return (
    <section id="fit" className="py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 text-center max-w-3xl mx-auto">
          <p className="text-white/55 text-lg sm:text-xl leading-relaxed font-light">
            <span className="text-white/25 text-2xl leading-none mr-1">&ldquo;</span>
            {t("quote")}
            <span className="text-white/25 text-2xl leading-none ml-1">&rdquo;</span>
          </p>
        </div>
        <FitList
          goodFit={goodFit}
          notFit={notFit}
          goodFitHeading={t("goodFitHeading")}
          notFitHeading={t("notFitHeading")}
        />
      </div>
    </section>
  );
}
