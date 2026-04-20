import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";
import styles from "./FitSection.module.css";

type FitSectionProps = { sectionNumber?: string }

export async function FitSection({ sectionNumber }: FitSectionProps) {
  const t = await getTranslations("fit");
  const goodFit = t.raw("goodFit") as string[];
  const notFit = t.raw("notFit") as string[];

  return (
    <section id="fit" className="py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className="reveal mb-10 text-center max-w-3xl mx-auto">
          <p className="font-heading text-white/80 text-xl sm:text-2xl leading-snug font-light">
            <span className={`text-2xl leading-none mr-1 ${styles.quoteMark}`}>&ldquo;</span>
            {t("quote")}
            <span className={`text-2xl leading-none ml-1 ${styles.quoteMark}`}>&rdquo;</span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 items-start">
          <div className={`reveal rounded-2xl p-7 ${styles.goodCard}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.goodHeadingIcon}`}>
                <CheckIcon className="w-4 h-4 text-green-400" strokeWidth={2.5} />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">{t("goodFitHeading")}</h3>
            </div>

            <div className={`rounded-xl p-5 mb-5 ${styles.featured}`}>
              <p className={`text-[0.7rem] font-bold uppercase mb-2 ${styles.featuredEyebrow}`}>
                {t("featuredEyebrow")}
              </p>
              <p className={`text-[0.95rem] leading-relaxed ${styles.featuredBody}`}>
                {t("featuredBody")}
              </p>
            </div>

            <ul>
              {goodFit.map((text, index) => (
                <li
                  key={text}
                  className={`flex items-start gap-3 text-sm leading-relaxed py-4 ${styles.bulletText} ${index > 0 ? styles.bulletDivider : ""}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${styles.dot}`} aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`reveal rounded-2xl p-7 ${styles.notCard}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.notHeadingIcon}`}>
                <XMarkIcon className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">{t("notFitHeading")}</h3>
            </div>

            <ul>
              {notFit.map((text, index) => (
                <li
                  key={text}
                  className={`flex items-start gap-3 text-sm leading-relaxed py-4 ${styles.bulletText} ${index > 0 ? styles.bulletDivider : ""}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${styles.dotNot}`} aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={`reveal mt-10 text-center text-sm italic ${styles.closing}`}>
          {t("closingLine")}
        </p>
      </div>
    </section>
  );
}
