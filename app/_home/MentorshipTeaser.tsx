import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "../../assets/icons/ArrowRightIcon";
import { SparkleIcon } from "../../assets/icons/SparkleIcon";
import { Tag } from "../_components/Tag";

export async function MentorshipTeaser() {
  const t = await getTranslations("mentorship");
  return (
    <section className="py-10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="reveal glass rounded-3xl p-7 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8"
          style={{ borderColor: "rgba(167,139,250,0.2)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 via-violet-400 to-transparent rounded-t-3xl pointer-events-none" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/15 border border-violet-500/25 text-violet-400">
                <SparkleIcon className="w-3 h-3 flex-shrink-0" />
                {t("eyebrow")}
              </span>
              <span className="text-white/25 text-xs">&middot; {t("badge")}</span>
            </div>
            <h3 className="font-heading font-black text-2xl text-white mb-2">{t("heading")}</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-lg">
              {t("body")}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5 justify-start lg:justify-end">
              <Tag>TypeScript</Tag>
              <Tag>NestJS</Tag>
              <Tag>Next.js</Tag>
              <Tag>React Native</Tag>
            </div>
            <a href="mentorship.html" className="btn-amber px-6 py-2.5 rounded-xl text-sm cursor-pointer inline-flex items-center gap-2">
              <span>{t("cta")}</span>
              <ArrowRightIcon className="w-4 h-4 relative z-10" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
