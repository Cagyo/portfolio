import { Tag } from "../../_components/tag/Tag";

type ExperienceCardProps = {
  title: string
  company: string
  period: string
  description: string
  tags: string[]
  logo: React.ReactNode
  accentOpacity?: string
}

export function ExperienceCard({ title, company, period, description, tags, logo, accentOpacity = "1" }: ExperienceCardProps) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default hover:border-amber-500/30 transition-colors duration-200">
      <div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-l-2xl"
        style={{ opacity: accentOpacity }}
      />
      <div className="pl-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 mt-0.5">{logo}</div>
            <div>
              <p className="font-heading font-bold text-white">{title}</p>
              <p className="text-amber-400/80 text-sm font-medium mt-0.5">{company}</p>
            </div>
          </div>
          <span className="text-white/30 text-xs whitespace-nowrap mt-1">{period}</span>
        </div>
        <p className="text-white/50 text-sm mt-3 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
