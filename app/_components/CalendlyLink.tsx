import { getTranslations } from "next-intl/server";
import { CalendarIcon } from "../../assets/icons/CalendarIcon";
import { ExternalLinkIcon } from "../../assets/icons/ExternalLinkIcon";

type CalendlyLinkProps = {
  href?: string
}

export async function CalendlyLink({ href = "https://calendly.com/" }: CalendlyLinkProps) {
  const t = await getTranslations("contact");

  return (
    <div>
      <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-semibold">{t("preferCall")}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 glass rounded-2xl p-4 hover:border-[#006BFF]/40 transition-all duration-200 cursor-pointer"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
          style={{ background: "#006BFF" }}
        >
          <CalendarIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm group-hover:text-white transition-colors">{t("bookDiscovery")}</p>
          <p className="text-white/35 text-xs mt-0.5">{t("bookDiscoveryMeta")}</p>
        </div>
        <ExternalLinkIcon className="w-4 h-4 text-white/25 group-hover:text-[#006BFF] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
      </a>
    </div>
  );
}
