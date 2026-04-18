import styles from "./EngagementCard.module.css";

type EngagementCardProps = {
  tag: string
  tagIcon: React.ReactNode
  tagVariant?: "amber" | "purple" | "teal"
  kicker?: string
  title: string
  body: string
  bestFor: string
  bestForLabel: string
  note: string
  order?: string
  delay?: string
  ctaSlot?: React.ReactNode
}

const VARIANTS = {
  amber: {
    tag: styles.tagAmber,
    bestFor: styles.bestForAmber,
    label: "text-amber-500/70",
    bar: null,
    kicker: styles.kicker,
  },
  purple: {
    tag: styles.tagPurple,
    bestFor: styles.bestForPurple,
    label: "text-purple-400/70",
    bar: "from-purple-600 via-purple-400 to-purple-600",
    kicker: styles.kicker,
  },
  teal: {
    tag: styles.tagTeal,
    bestFor: styles.bestForTeal,
    label: "text-teal-400/70",
    bar: "from-teal-600 via-teal-400 to-teal-600",
    kicker: styles.kickerTeal,
  },
} as const

export function EngagementCard({
  tag, tagIcon, tagVariant = "amber", kicker, title, body, bestFor, bestForLabel, note, order, delay, ctaSlot,
}: EngagementCardProps) {
  const variant = VARIANTS[tagVariant]

  return (
    <div
      className={`reveal glass rounded-2xl flex flex-col gap-5 overflow-hidden cursor-default ${order ?? ""}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      {variant.bar && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${variant.bar}`} />
      )}
      <div className="p-6 flex flex-col gap-5 flex-1 relative">
        <div className="flex items-center">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${variant.tag}`}>
            {tagIcon}
            {tag}
          </span>
        </div>
        <div>
          {kicker && (
            <p className={`text-xs mb-1.5 ${variant.kicker}`}>{kicker}</p>
          )}
          <h3 className="font-heading font-black text-xl text-white leading-tight">{title}</h3>
        </div>
        <p className="text-white/55 text-sm leading-relaxed flex-1">{body}</p>
        <div className={`rounded-xl p-4 ${variant.bestFor}`}>
          <p className={`${variant.label} text-xs uppercase tracking-widest font-bold mb-1.5`}>{bestForLabel}</p>
          <p className="text-white/60 text-sm leading-relaxed">{bestFor}</p>
        </div>
        {ctaSlot}
        <p className="text-white/30 text-xs italic border-t border-white/5 pt-4">{note}</p>
      </div>
    </div>
  );
}
