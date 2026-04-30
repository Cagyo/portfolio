type AccentColor = "amber" | "violet"

export const SECTION_HEADER_ACCENT = {
  amber: {
    number: "text-amber-500",
    line: "bg-gradient-to-r from-amber-500/30 to-transparent",
  },
  violet: {
    number: "text-violet-400",
    line: "bg-gradient-to-r from-violet-500/30 to-transparent",
  },
} as const satisfies Record<AccentColor, { number: string; line: string }>

type SectionHeaderProps = {
  number?: string
  title: string
  accentColor?: AccentColor
}

export function SectionHeader({ number, title, accentColor = "amber" }: SectionHeaderProps) {
  const accent = SECTION_HEADER_ACCENT[accentColor];

  return (
    <div className="reveal flex items-center gap-4 mb-16">
      {number && <span className={`${accent.number} font-mono text-sm font-bold`}>{number}</span>}
      <h2 className="font-heading font-black text-4xl sm:text-5xl text-white">{title}</h2>
      <div className={`flex-1 h-px ${accent.line} ml-4`} />
    </div>
  );
}
