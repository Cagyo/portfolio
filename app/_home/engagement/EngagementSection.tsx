import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { Button } from "@/app/_components/button/Button";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LightningIcon } from "@/assets/icons/LightningIcon";
import { WarningIcon } from "@/assets/icons/WarningIcon";
import { EngagementCard } from "./EngagementCard";
import { EngagementCta } from "./EngagementCta";
import type { Interest } from "../contact/contact-types";

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

const engagementCtaLinkClassName = "w-fit text-sm font-medium leading-[1.4] no-underline underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:underline";
const engagementCtaPrimaryClassName = "text-amber-light [html[data-theme=light]_&]:text-[var(--tag-color)]";
const engagementCtaSecondaryClassName = "text-[color-mix(in_srgb,var(--amber-light)_70%,var(--text-primary))] hover:text-amber-light";

const VISIBLE_CARD_META: CardMeta[] = [
  { translationIndex: 2, tone: "primary", role: "featured", IconComponent: WarningIcon, interest: "rescue", ctaClass: engagementCtaPrimaryClassName },
  { translationIndex: 0, tone: "secondary", role: "supporting", IconComponent: LightningIcon, interest: "mvp", ctaClass: engagementCtaSecondaryClassName, delay: "0.08s" },
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

        <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
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
                    className={`${engagementCtaLinkClassName} ${meta.ctaClass}`}
                  />
                }
              />
            )

            if (index === 0) {
              return cardNode
            }

            return (
              <div key={card.tag} className="grid content-stretch gap-5">
                {cardNode}
                <div className="reveal glass flex flex-col items-center justify-between gap-4 rounded-2xl p-5 delay-[160ms] sm:flex-row sm:text-left">
                  <p className="text-muted-foreground text-sm text-center sm:text-left">
                    {t("footerText")}
                  </p>
                  <Button href="#contact" className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm">
                    <span>{t("bookCall")}</span>
                    <ExternalLinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
