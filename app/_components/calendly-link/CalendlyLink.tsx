import { getTranslations } from "next-intl/server";
import { CalendarIcon } from "@/assets/icons/CalendarIcon";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { siteConfig } from "@/app/_config/site-config";
import styles from "./CalendlyLink.module.css";

type CalendlyLinkProps = {
  href?: string
}

export async function CalendlyLink({ href = siteConfig.calendly.url }: CalendlyLinkProps) {
  const t = await getTranslations("contact");

  return (
    <div>
      <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-semibold">{t("preferCall")}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-4 glass rounded-2xl p-4 transition-all duration-200 cursor-pointer ${styles.link}`}
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 ${styles.btn}`}
        >
          <CalendarIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm group-hover:text-white transition-colors">{t("bookDiscovery")}</p>
          <p className="text-white/35 text-xs mt-0.5">{t("bookDiscoveryMeta")}</p>
        </div>
        <ExternalLinkIcon className={`w-4 h-4 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 ${styles.externalIcon}`} />
      </a>
    </div>
  );
}
