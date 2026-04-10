import styles from "./EngagementCard.module.css";

type EngagementCardProps = {
  tag: string
  tagIcon: React.ReactNode
  tagVariant?: "amber" | "purple" | "teal"
  title: string
  body: string
  bestFor: string
  bestForLabel: string
  note: string
  featured?: boolean
  mostPopularLabel?: string
  order?: string
  delay?: string
}

export function EngagementCard({
  tag, tagIcon, tagVariant = "amber", title, body, bestFor, bestForLabel, note, featured, mostPopularLabel, order, delay,
}: EngagementCardProps) {
  const tagClass = {
    amber: styles.tagAmber,
    purple: styles.tagPurple,
    teal: styles.tagTeal,
  }[tagVariant]

  const bestForClass = {
    amber: styles.bestForAmber,
    purple: styles.bestForPurple,
    teal: styles.bestForTeal,
  }[tagVariant]

  const labelColorClass = {
    amber: "text-amber-500/70",
    purple: "text-purple-400/70",
    teal: "text-teal-400/70",
  }[tagVariant]

  return (
    <div
      className={`reveal glass rounded-2xl flex flex-col gap-5 overflow-hidden cursor-default ${order ?? ""}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600" />
      )}
      <div className="p-6 flex flex-col gap-5 flex-1 relative">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tagClass}`}>
            {tagIcon}
            {tag}
          </span>
          {featured && (
            <span className="text-purple-400/40 text-xs font-medium">{mostPopularLabel}</span>
          )}
        </div>
        <div>
          <h3 className="font-heading font-black text-xl text-white leading-tight">{title}</h3>
        </div>
        <p className="text-white/55 text-sm leading-relaxed flex-1">{body}</p>
        <div className={`rounded-xl p-4 ${bestForClass}`}>
          <p className={`${labelColorClass} text-xs uppercase tracking-widest font-bold mb-1.5`}>{bestForLabel}</p>
          <p className="text-white/60 text-sm leading-relaxed">{bestFor}</p>
        </div>
        <p className="text-white/30 text-xs italic border-t border-white/5 pt-4">{note}</p>
      </div>
    </div>
  );
}
