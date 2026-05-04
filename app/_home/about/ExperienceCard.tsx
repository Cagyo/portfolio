import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { Tag } from "@/app/_components/tag/Tag";
import { ShowMoreText } from "@/app/_components/show-more/ShowMoreText";
import styles from "./ExperienceCard.module.css";

type ExperiencePosition = {
  title: string
  period: string
  description: string
}

type ExperienceCardProps = {
  company: string
  period: string
  tags: string[]
  capabilities?: string[]
  logo?: React.ReactNode
  accentOpacity?: string
  projectsHref?: string
  positions: ExperiencePosition[]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ExperienceCard({
  company,
  period,
  tags,
  capabilities,
  logo,
  accentOpacity = "1",
  projectsHref,
  positions,
}: ExperienceCardProps) {
  const logoNode = logo ?? (
    <div className="glass w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
      <span className="text-amber-400 text-xs font-bold tracking-wider leading-none">
        {getInitials(company)}
      </span>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default hover:border-amber-500/30 transition-colors duration-200">
      <div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-l-2xl"
        style={{ opacity: accentOpacity }}
      />
      <div className="pl-4">
          {/* Company header */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{logoNode}</div>
            <div className="flex-1 flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-white">{company}</p>
                <p className="text-white/30 text-xs mt-0.5">{period}</p>
              </div>
              {projectsHref && (
                <Link
                  href={projectsHref}
                  className="text-amber-500/60 text-xs whitespace-nowrap hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5 flex items-center gap-1"
                >
                  View projects <ArrowRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {capabilities && capabilities.length > 0 && (
            <div className={styles.capabilityList}>
              {capabilities.map((capability) => (
                <span key={capability} className={styles.capabilityChip}>
                  {capability}
                </span>
              ))}
            </div>
          )}

          {/* Positions timeline */}
          <div className="mt-4">
            {positions.map((pos, posIndex) => (
              <div key={pos.title} className={styles.positionItem}>
                <div className={styles.track}>
                  <div className={styles.dot} />
                  {posIndex < positions.length - 1 && <div className={styles.connector} />}
                </div>
                <div className={posIndex < positions.length - 1 ? "pb-4" : ""}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-white/90 font-medium text-sm">{pos.title}</p>
                    <span className="text-white/30 text-xs whitespace-nowrap">{pos.period}</span>
                  </div>
                  <ShowMoreText
                    text={pos.description}
                    textClassName="text-white/50 text-sm mt-1 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
