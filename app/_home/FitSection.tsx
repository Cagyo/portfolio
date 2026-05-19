import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";

type FitSectionProps = { sectionNumber?: string }

const quotePanelClassName = "reveal mx-auto mb-11 max-w-4xl border-y border-border py-5 max-md:mb-8";
const quoteClassName = "text-left text-xl font-normal leading-[1.45] text-foreground/80 [html[data-theme=light]_&]:text-foreground-soft sm:text-2xl";
const quoteMarkClassName = "mx-0.5 inline-block text-2xl leading-[0] text-amber-foreground/60";
const ledgerClassName = "reveal grid grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_70px_color-mix(in_srgb,var(--amber)_8%,transparent)] [html[data-theme=light]_&]:shadow-[0_24px_70px_color-mix(in_srgb,var(--text-primary)_7%,transparent)] max-md:grid-cols-1";
const ledgerPaneClassName = "min-w-0 p-7 lg:p-8 max-md:p-5";
const goodPaneClassName = "border-r border-border bg-[linear-gradient(140deg,color-mix(in_srgb,var(--green)_7%,transparent),transparent_54%)] [html[data-theme=light]_&]:bg-[linear-gradient(140deg,color-mix(in_srgb,var(--green)_9%,transparent),transparent_56%)] max-md:border-r-0 max-md:border-b";
const notPaneClassName = "bg-[linear-gradient(140deg,color-mix(in_srgb,var(--red)_5%,transparent),transparent_58%)] [html[data-theme=light]_&]:bg-[linear-gradient(140deg,color-mix(in_srgb,var(--red)_7%,transparent),transparent_60%)]";
const panelHeaderClassName = "flex items-center gap-3.5 border-b border-border pb-4";
const headingIconClassName = "inline-flex size-8 shrink-0 items-center justify-center rounded-md border";
const goodStatusClassName = "border-[color-mix(in_srgb,var(--green)_20%,transparent)] bg-[color-mix(in_srgb,var(--green)_12%,transparent)] text-[var(--green-light)] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--green)_8%,transparent)] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--green)_72%,var(--text-primary))]";
const notStatusClassName = "border-[color-mix(in_srgb,var(--red)_18%,transparent)] bg-[color-mix(in_srgb,var(--red)_10%,transparent)] text-[var(--red)] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--red)_7%,transparent)] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--red)_76%,var(--text-primary))]";
const panelTitleClassName = "font-heading text-lg font-bold leading-tight text-foreground";
const featuredClassName = "mt-5 mb-2 border-y border-[color-mix(in_srgb,var(--amber)_22%,transparent)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--amber)_10%,transparent),transparent_80%)] p-5 [html[data-theme=light]_&]:border-[color-mix(in_srgb,var(--amber-dark)_30%,transparent)] [html[data-theme=light]_&]:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--amber)_13%,transparent),transparent_82%)]";
const featuredEyebrowClassName = "mb-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-amber-foreground/85";
const featuredBodyClassName = "max-w-2xl text-[0.95rem] leading-[1.7] text-foreground/85 [html[data-theme=light]_&]:text-foreground";
const criteriaListClassName = "m-0 grid list-none p-0 pt-1";
const criterionClassName = "grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-3 border-t border-border py-[0.95rem] text-[0.925rem] leading-[1.65] text-foreground-soft first:border-t-0 max-md:grid-cols-[1.4rem_minmax(0,1fr)] max-md:gap-[0.65rem]";
const markerClassName = "mt-[0.05rem] inline-flex size-6 items-center justify-center border border-current";
const goodMarkerClassName = "rounded-full bg-[color-mix(in_srgb,var(--green)_11%,transparent)] text-[var(--green-light)] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--green)_8%,transparent)] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--green)_72%,var(--text-primary))]";
const notMarkerClassName = "rounded-md bg-[color-mix(in_srgb,var(--red)_9%,transparent)] text-[var(--red)] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--red)_7%,transparent)] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--red)_76%,var(--text-primary))]";

export async function FitSection({ sectionNumber }: FitSectionProps) {
  const t = await getTranslations("fit");
  const goodFit = t.raw("goodFit") as string[];
  const notFit = t.raw("notFit") as string[];

  return (
    <section id="fit" className="py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className={quotePanelClassName}>
          <p className={quoteClassName}>
            <span className={quoteMarkClassName}>&ldquo;</span>
            {t("quote")}
            <span className={quoteMarkClassName}>&rdquo;</span>
          </p>
        </div>

        <div className={ledgerClassName}>
          <article className={`${ledgerPaneClassName} ${goodPaneClassName}`} aria-labelledby="fit-good-heading">
            <div className={panelHeaderClassName}>
              <span className={`${headingIconClassName} ${goodStatusClassName}`} aria-hidden="true">
                <CheckIcon className="size-4" strokeWidth={2.5} />
              </span>
              <h3 id="fit-good-heading" className={panelTitleClassName}>{t("goodFitHeading")}</h3>
            </div>

            <div className={featuredClassName}>
              <p className={featuredEyebrowClassName}>
                {t("featuredEyebrow")}
              </p>
              <p className={featuredBodyClassName}>
                {t("featuredBody")}
              </p>
            </div>

            <ul className={criteriaListClassName}>
              {goodFit.map((text) => (
                <li
                  key={text}
                  className={criterionClassName}
                >
                  <span className={`${markerClassName} ${goodMarkerClassName}`} aria-hidden="true">
                    <CheckIcon className="size-3" strokeWidth={2.5} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className={`${ledgerPaneClassName} ${notPaneClassName}`} aria-labelledby="fit-not-heading">
            <div className={panelHeaderClassName}>
              <span className={`${headingIconClassName} ${notStatusClassName}`} aria-hidden="true">
                <XMarkIcon className="size-4" />
              </span>
              <h3 id="fit-not-heading" className={panelTitleClassName}>{t("notFitHeading")}</h3>
            </div>

            <ul className={criteriaListClassName}>
              {notFit.map((text) => (
                <li
                  key={text}
                  className={criterionClassName}
                >
                  <span className={`${markerClassName} ${notMarkerClassName}`} aria-hidden="true">
                    <XMarkIcon className="size-3" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="reveal mt-10 text-center text-sm italic text-faint-foreground">
          {t("closingLine")}
        </p>
      </div>
    </section>
  );
}
