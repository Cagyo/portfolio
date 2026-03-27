type SectionHeaderProps = {
  number: string
  title: string
  accentColor?: "amber" | "violet"
}

export function SectionHeader({ number, title, accentColor = "amber" }: SectionHeaderProps) {
  const numColor = accentColor === "violet" ? "text-violet-400" : "text-amber-500";
  const lineColor = accentColor === "violet"
    ? "bg-gradient-to-r from-violet-500/30 to-transparent"
    : "bg-gradient-to-r from-amber-500/30 to-transparent";

  return (
    <div className="reveal flex items-center gap-4 mb-16">
      <span className={`${numColor} font-mono text-sm font-bold`}>{number}</span>
      <h2 className="font-heading font-black text-4xl sm:text-5xl text-white">{title}</h2>
      <div className={`flex-1 h-px ${lineColor} ml-4`} />
    </div>
  );
}
