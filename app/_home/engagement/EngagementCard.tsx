import type { ReactNode } from "react";
import styles from "./EngagementCard.module.css";

type CardTone = "primary" | "secondary"
type CardRole = "featured" | "supporting"

type EngagementCardProps = {
  tag: string
  tagIcon: ReactNode
  tone?: CardTone
  role?: CardRole
  kicker?: string
  title: string
  body: string
  bestFor: string
  bestForLabel: string
  note: string
  delay?: string
  ctaSlot?: ReactNode
}

const TONES = {
  primary: {
    tag: styles.tagPrimary,
    bestFor: styles.bestForPrimary,
    label: styles.labelPrimary,
    kicker: styles.kickerPrimary,
  },
  secondary: {
    tag: styles.tagSecondary,
    bestFor: styles.bestForSecondary,
    label: styles.labelSecondary,
    kicker: styles.kicker,
  },
} as const satisfies Record<CardTone, { tag: string; bestFor: string; label: string; kicker: string }>

const ROLES = {
  featured: styles.featured,
  supporting: styles.supporting,
} as const satisfies Record<CardRole, string>

export function EngagementCard({
  tag, tagIcon, tone = "secondary", role = "supporting", kicker, title, body, bestFor, bestForLabel, note, delay, ctaSlot,
}: EngagementCardProps) {
  const toneClasses = TONES[tone]

  return (
    <article
      className={`reveal ${styles.card} ${ROLES[role]}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.tag} ${toneClasses.tag}`}>
            {tagIcon}
            {tag}
          </span>
        </div>
        <div>
          {kicker && (
            <p className={`${styles.kicker} ${toneClasses.kicker}`}>{kicker}</p>
          )}
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.body}>{body}</p>
        <div className={`${styles.bestFor} ${toneClasses.bestFor}`}>
          <p className={`${styles.label} ${toneClasses.label}`}>{bestForLabel}</p>
          <p className={styles.bestForText}>{bestFor}</p>
        </div>
        {ctaSlot}
        <p className={styles.note}>{note}</p>
      </div>
    </article>
  );
}
