import { getTranslations } from "next-intl/server";

export async function ScrollIndicator() {
  const t = await getTranslations("common");

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="text-white/30 text-xs tracking-widest uppercase">{t("scroll")}</span>
      <div className="w-px h-12 bg-gradient-to-b from-amber-500/60 to-transparent" />
    </div>
  );
}
