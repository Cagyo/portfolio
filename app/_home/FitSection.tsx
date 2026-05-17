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

        <div className={`reveal ${styles.quotePanel}`}>
          <p className={styles.quote}>
            <span className={styles.quoteMark}>&ldquo;</span>
            {t("quote")}
            <span className={styles.quoteMark}>&rdquo;</span>
          </p>
        </div>

        <div className={`reveal ${styles.ledger}`}>
          <article className={`${styles.ledgerPane} ${styles.goodPane}`} aria-labelledby="fit-good-heading">
            <div className={styles.panelHeader}>
              <span className={`${styles.headingIcon} ${styles.goodHeadingIcon}`} aria-hidden="true">
                <CheckIcon className={styles.statusIcon} strokeWidth={2.5} />
              </span>
              <h3 id="fit-good-heading" className={styles.panelTitle}>{t("goodFitHeading")}</h3>
            </div>

            <div className={styles.featured}>
              <p className={styles.featuredEyebrow}>
                {t("featuredEyebrow")}
              </p>
              <p className={styles.featuredBody}>
                {t("featuredBody")}
              </p>
            </div>

            <ul className={styles.criteriaList}>
              {goodFit.map((text) => (
                <li
                  key={text}
                  className={styles.criterion}
                >
                  <span className={`${styles.marker} ${styles.goodMarker}`} aria-hidden="true">
                    <CheckIcon className={styles.markerIcon} strokeWidth={2.5} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className={`${styles.ledgerPane} ${styles.notPane}`} aria-labelledby="fit-not-heading">
            <div className={styles.panelHeader}>
              <span className={`${styles.headingIcon} ${styles.notHeadingIcon}`} aria-hidden="true">
                <XMarkIcon className={styles.statusIcon} />
              </span>
              <h3 id="fit-not-heading" className={styles.panelTitle}>{t("notFitHeading")}</h3>
            </div>

            <ul className={styles.criteriaList}>
              {notFit.map((text) => (
                <li
                  key={text}
                  className={styles.criterion}
                >
                  <span className={`${styles.marker} ${styles.notMarker}`} aria-hidden="true">
                    <XMarkIcon className={styles.markerIcon} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className={`reveal ${styles.closing}`}>
          {t("closingLine")}
        </p>
      </div>
    </section>
  );
}
