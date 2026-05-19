import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LightningIcon } from "@/assets/icons/LightningIcon";
import { WarningIcon } from "@/assets/icons/WarningIcon";
import { EngagementCard } from "./EngagementCard";
import { EngagementCta } from "./EngagementCta";
import type { Interest } from "../contact/contact-types";
import cardStyles from "./EngagementCard.module.css";
import styles from "./EngagementSection.module.css";

type CardTone = "primary" | "secondary"
type CardRole = "featured" | "supporting"

type CardMeta = {
  translationIndex: number
  tone: CardTone
  role: CardRole
  IconComponent: ComponentType<{ className?: string }>
  interest: Interest
  ctaClass: string
  delay?: string
}

const VISIBLE_CARD_META: CardMeta[] = [
  { translationIndex: 2, tone: "primary", role: "featured", IconComponent: WarningIcon, interest: "rescue", ctaClass: cardStyles.ctaPrimary },
  { translationIndex: 0, tone: "secondary", role: "supporting", IconComponent: LightningIcon, interest: "mvp", ctaClass: cardStyles.ctaSecondary, delay: "0.08s" },
]

type EngagementCardContent = {
  tag: string;
  kicker?: string;
  title: string;
  body: string;
  bestFor: string;
  note: string;
  cta: string;
}

type EngagementSectionProps = { sectionNumber?: string }

export async function EngagementSection({ sectionNumber }: EngagementSectionProps) {
  const t = await getTranslations("engagement");
  const cards = t.raw("cards") as EngagementCardContent[];

  const visibleCards = VISIBLE_CARD_META.map((meta) => {
    const card = cards[meta.translationIndex]

    if (!card) {
      throw new Error(`engagement.cards is missing item at index ${meta.translationIndex}`)
    }

    return { card, meta }
  })

  return (
    <section id="engagement" className="py-16 relative overflow-hidden">
      <BlobBackground position="-bottom-24 left-1/4" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className={styles.pathGrid}>
          {visibleCards.map(({ card, meta }, index) => {
            const cardNode = (
              <EngagementCard
                key={card.tag}
                tag={card.tag}
                tagIcon={<meta.IconComponent className="w-3 h-3" />}
                tone={meta.tone}
                role={meta.role}
                kicker={card.kicker}
                title={card.title}
                body={card.body}
                bestFor={card.bestFor}
                bestForLabel={t("bestForLabel")}
                note={card.note}
                delay={meta.delay}
                ctaSlot={
                  <EngagementCta
                    text={card.cta}
                    interest={meta.interest}
                    className={`${cardStyles.ctaLink} ${meta.ctaClass}`}
                  />
                }
              />
            )

            if (index === 0) {
              return cardNode
            }

            return (
              <div key={card.tag} className={styles.secondaryStack}>
                {cardNode}
                <div className={`reveal glass ${styles.cta}`}>
                  <p className="text-muted-foreground text-sm text-center sm:text-left">
                    {t("footerText")}
                  </p>
                  <a href="#contact" className="btn-amber px-6 py-2.5 rounded-xl text-sm flex-shrink-0 cursor-pointer inline-flex items-center gap-2">
                    <span>{t("bookCall")}</span>
                    <ExternalLinkIcon className="w-4 h-4 relative z-10" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
