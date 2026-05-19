import type { ReactNode } from "react";
import { cn } from "@/app/_lib/cn";

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

const cardBaseClassName = "reveal relative flex min-h-full cursor-default flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_60px_color-mix(in_srgb,var(--bg)_45%,transparent)] backdrop-blur-[8px]";
const contentBaseClassName = "relative flex flex-1 flex-col gap-5 p-6 max-[640px]:p-5";
const tagBaseClassName = "inline-flex w-fit items-center gap-1.5 rounded-full border border-transparent px-3 py-1 text-xs font-bold uppercase leading-none tracking-normal";
const kickerBaseClassName = "m-0 mb-1.5 text-[0.8125rem] italic leading-[1.45]";
const titleBaseClassName = "m-0 font-heading text-xl font-black leading-[1.05] text-foreground";
const bodyBaseClassName = "m-0 flex-1 text-sm leading-[1.7] text-muted-foreground";
const bestForBaseClassName = "rounded-[0.875rem] border border-transparent p-4";
const labelBaseClassName = "m-0 mb-1.5 text-xs font-bold uppercase leading-[1.3] tracking-normal";
const bestForTextBaseClassName = "m-0 text-sm leading-[1.65] text-muted-foreground";
const noteClassName = "m-0 border-t border-border pt-4 text-xs italic leading-normal text-ghost-foreground";

const TONES = {
  primary: {
    tag: "border-[color-mix(in_srgb,var(--amber)_34%,transparent)] bg-amber/14 text-amber-light [html[data-theme=light]_&]:text-[var(--tag-color)]",
    bestFor: "border-[color-mix(in_srgb,var(--amber)_22%,transparent)] bg-amber/7 [html[data-theme=light]_&]:border-border-amber [html[data-theme=light]_&]:bg-amber/6",
    label: "text-amber-light [html[data-theme=light]_&]:text-[var(--tag-color)]",
    kicker: "text-[color-mix(in_srgb,var(--amber-light)_82%,var(--text-primary))] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--amber-dark)_84%,var(--text-primary))]",
  },
  secondary: {
    tag: "border-[color-mix(in_srgb,var(--text-primary)_18%,var(--border))] bg-foreground/8 text-foreground-soft",
    bestFor: "border-[color-mix(in_srgb,var(--text-primary)_13%,var(--border))] bg-foreground/6",
    label: "text-[color-mix(in_srgb,var(--text-secondary)_64%,transparent)]",
    kicker: "text-faint-foreground",
  },
} as const satisfies Record<CardTone, { tag: string; bestFor: string; label: string; kicker: string }>

const ROLES = {
  featured: {
    card: "border-[color-mix(in_srgb,var(--amber)_34%,var(--border))] bg-[color-mix(in_srgb,var(--amber)_8%,var(--surface))] shadow-[0_30px_80px_color-mix(in_srgb,var(--amber)_14%,transparent)] [html[data-theme=light]_&]:border-border-amber [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--amber)_7%,var(--surface))] [html[data-theme=light]_&]:shadow-[0_24px_70px_color-mix(in_srgb,var(--amber)_12%,transparent)]",
    content: "gap-[clamp(1.25rem,2vw,1.75rem)] p-[clamp(1.5rem,3vw,2.25rem)] max-[640px]:p-5",
    title: "max-w-[13ch] text-[clamp(1.85rem,3vw,2.7rem)] max-[640px]:max-w-full max-[640px]:text-[1.75rem]",
    body: "max-w-[65ch] text-base leading-[1.75] text-foreground-soft",
    bestForText: "text-foreground-soft",
  },
  supporting: {
    card: "border-[color-mix(in_srgb,var(--text-primary)_14%,var(--border))] bg-foreground/5",
    content: "",
    title: "",
    body: "text-[color-mix(in_srgb,var(--text-secondary)_78%,transparent)]",
    bestForText: "",
  },
} as const satisfies Record<CardRole, { card: string; content: string; title: string; body: string; bestForText: string }>

export function EngagementCard({
  tag, tagIcon, tone = "secondary", role = "supporting", kicker, title, body, bestFor, bestForLabel, note, delay, ctaSlot,
}: EngagementCardProps) {
  const toneClasses = TONES[tone]
  const roleClasses = ROLES[role]

  return (
    <article
      className={cn(cardBaseClassName, roleClasses.card)}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <div className={cn(contentBaseClassName, roleClasses.content)}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn(tagBaseClassName, toneClasses.tag)}>
            {tagIcon}
            {tag}
          </span>
        </div>
        <div>
          {kicker && (
            <p className={cn(kickerBaseClassName, toneClasses.kicker)}>{kicker}</p>
          )}
          <h3 className={cn(titleBaseClassName, roleClasses.title)}>{title}</h3>
        </div>
        <p className={cn(bodyBaseClassName, roleClasses.body)}>{body}</p>
        <div className={cn(bestForBaseClassName, toneClasses.bestFor)}>
          <p className={cn(labelBaseClassName, toneClasses.label)}>{bestForLabel}</p>
          <p className={cn(bestForTextBaseClassName, roleClasses.bestForText)}>{bestFor}</p>
        </div>
        {ctaSlot}
        <p className={noteClassName}>{note}</p>
      </div>
    </article>
  );
}
