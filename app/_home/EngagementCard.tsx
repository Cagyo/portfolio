type EngagementCardProps = {
  tag: string
  tagIcon: React.ReactNode
  tagVariant?: "amber" | "purple" | "teal"
  title: string
  body: string
  bestFor: string
  note: string
  featured?: boolean
  order?: string
  delay?: string
}

export function EngagementCard({
  tag, tagIcon, tagVariant = "amber", title, body, bestFor, note, featured, order, delay,
}: EngagementCardProps) {
  const tagStyle = {
    amber: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.30)", color: "#F59E0B" },
    purple: { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.30)", color: "#A855F7" },
    teal: { bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)", color: "#14B8A6" },
  }[tagVariant];

  const bestForStyle = {
    amber: { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", labelColor: "text-amber-500/70" },
    purple: { bg: "rgba(168,85,247,0.06)", border: "rgba(168,85,247,0.2)", labelColor: "text-purple-400/70" },
    teal: { bg: "rgba(20,184,166,0.06)", border: "rgba(20,184,166,0.2)", labelColor: "text-teal-400/70" },
  }[tagVariant];

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
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color }}
          >
            {tagIcon}
            {tag}
          </span>
          {featured && (
            <span className="text-purple-400/40 text-xs font-medium">Most popular</span>
          )}
        </div>
        <div>
          <h3 className="font-heading font-black text-xl text-white leading-tight">{title}</h3>
        </div>
        <p className="text-white/55 text-sm leading-relaxed flex-1">{body}</p>
        <div
          className="rounded-xl p-4"
          style={{ background: bestForStyle.bg, border: `1px solid ${bestForStyle.border}` }}
        >
          <p className={`${bestForStyle.labelColor} text-xs uppercase tracking-widest font-bold mb-1.5`}>Best for</p>
          <p className="text-white/60 text-sm leading-relaxed">{bestFor}</p>
        </div>
        <p className="text-white/30 text-xs italic border-t border-white/5 pt-4">{note}</p>
      </div>
    </div>
  );
}
