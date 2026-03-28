import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "../../assets/icons/ArrowRightIcon";
import { Button } from "../_components/Button";

export async function BusinessImpact() {
  const t = await getTranslations("businessImpact");
  const metrics = t.raw("metrics") as { value: string; label: string }[];

  return (
    <div className="reveal mt-12">
      <div
        className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{ borderColor: "rgba(245,158,11,0.2)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent rounded-t-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-shrink-0">
            <p className="text-amber-500/70 text-xs uppercase tracking-wider font-semibold mb-2">{t("eyebrow")}</p>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
              {t("heading")}
              <br />
              <span className="text-gradient">{t("headingGradient")}</span>
            </h3>
          </div>
          <div className="hidden lg:block w-px self-stretch bg-white/10 mx-2" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 flex-1">
            {metrics.map((m) => (
              <div key={m.value}>
                <p className="font-heading font-black text-3xl text-gradient">{m.value}</p>
                <p className="text-white/40 text-xs mt-1 leading-snug whitespace-pre-line">{m.label}</p>
              </div>
            ))}
          </div>
          <Button
            href="#contact"
            className="px-6 py-3 rounded-xl text-sm flex-shrink-0 inline-flex items-center gap-2 whitespace-nowrap"
          >
            {t("cta")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
