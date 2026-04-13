import { getTranslations } from "next-intl/server";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { BadgeCheckIcon } from "../../../assets/icons/BadgeCheckIcon";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { LightningIcon } from "../../../assets/icons/LightningIcon";
import { WarningIcon } from "../../../assets/icons/WarningIcon";
import { EngagementCard } from "./EngagementCard";
import styles from "./EngagementSection.module.css";

type TagVariant = "amber" | "purple" | "teal";

const TAG_VARIANTS: TagVariant[] = ["amber", "purple", "teal"];
const TAG_ICONS = [
  <LightningIcon key="lightning" className="w-3 h-3" />,
  <BadgeCheckIcon key="badge" className="w-3 h-3" />,
  <WarningIcon key="warning" className="w-3 h-3" />,
];
const ORDERS = ["order-2 lg:order-1", "order-1 lg:order-2", "order-3"];
const FEATURED = [false, true, false];
const DELAYS = [undefined, "0.1s", "0.2s"];

export async function EngagementSection() {
  const t = await getTranslations("engagement");
  const cards = t.raw("cards") as {
    tag: string;
    title: string;
    body: string;
    bestFor: string;
    note: string;
  }[];

  return (
    <section id="engagement" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="-bottom-24 left-1/4" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {cards.map((card, i) => (
            <EngagementCard
              key={card.title}
              tag={card.tag}
              tagIcon={TAG_ICONS[i]}
              tagVariant={TAG_VARIANTS[i]}
              title={card.title}
              body={card.body}
              bestFor={card.bestFor}
              bestForLabel={t("bestForLabel")}
              note={card.note}
              featured={FEATURED[i]}
              mostPopularLabel={FEATURED[i] ? t("mostPopular") : undefined}
              order={ORDERS[i]}
              delay={DELAYS[i]}
            />
          ))}
        </div>

        <div
          className={`reveal mt-10 glass rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${styles.cta}`}
        >
          <p className="text-white/50 text-sm text-center sm:text-left">
            {t("footerText")}
          </p>
          <a href="#contact" className="btn-amber px-6 py-2.5 rounded-xl text-sm flex-shrink-0 cursor-pointer inline-flex items-center gap-2">
            <span>{t("bookCall")}</span>
            <ExternalLinkIcon className="w-4 h-4 relative z-10" />
          </a>
        </div>
      </div>
    </section>
  );
}
