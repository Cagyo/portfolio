import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { BadgeCheckIcon } from "@/assets/icons/BadgeCheckIcon";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LightningIcon } from "@/assets/icons/LightningIcon";
import { WarningIcon } from "@/assets/icons/WarningIcon";
import { EngagementCard } from "./EngagementCard";
import { EngagementCta } from "./EngagementCta";
import type { Interest } from "../contact/contact-types";
import cardStyles from "./EngagementCard.module.css";
import styles from "./EngagementSection.module.css";

type TagVariant = "amber" | "purple" | "teal";

type CardMeta = {
  variant: TagVariant
  IconComponent: ComponentType<{ className?: string }>
  interest: Interest
  ctaClass: string
  order: string
  delay: string | undefined
}

const CARD_META: CardMeta[] = [
  { variant: "amber",  IconComponent: LightningIcon, interest: "mvp",        ctaClass: cardStyles.ctaAmber,  order: "order-2 lg:order-1", delay: undefined },
  { variant: "purple", IconComponent: BadgeCheckIcon, interest: "full-build", ctaClass: cardStyles.ctaPurple, order: "order-1 lg:order-2", delay: "0.1s" },
  { variant: "teal",   IconComponent: WarningIcon,    interest: "rescue",     ctaClass: cardStyles.ctaTeal,   order: "order-3",            delay: "0.2s" },
]

type EngagementSectionProps = { sectionNumber?: string }

export async function EngagementSection({ sectionNumber }: EngagementSectionProps) {
  const t = await getTranslations("engagement");
  const cards = t.raw("cards") as {
    tag: string;
    kicker?: string;
    title: string;
    body: string;
    bestFor: string;
    note: string;
    cta: string;
  }[];

  if (cards.length !== CARD_META.length) {
    throw new Error(`engagement.cards length (${cards.length}) must match CARD_META length (${CARD_META.length})`)
  }

  return (
    <section id="engagement" className="py-16 relative overflow-hidden">
      <BlobBackground position="-bottom-24 left-1/4" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {cards.map((card, index) => {
            const meta = CARD_META[index]
            return (
              <EngagementCard
                key={card.tag}
                tag={card.tag}
                tagIcon={<meta.IconComponent className="w-3 h-3" />}
                tagVariant={meta.variant}
                kicker={card.kicker}
                title={card.title}
                body={card.body}
                bestFor={card.bestFor}
                bestForLabel={t("bestForLabel")}
                note={card.note}
                order={meta.order}
                delay={meta.delay}
                ctaSlot={
                  <EngagementCta
                    text={card.cta}
                    interest={meta.interest}
                    className={`text-sm font-normal ${meta.ctaClass}`}
                  />
                }
              />
            )
          })}
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
