import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { Tag } from "@/app/_components/tag/Tag";
import { ShowMoreText } from "@/app/_components/show-more/ShowMoreText";
import { getProjectCountByStack, isFilterableStack } from "@/app/_data/projects/get-stack-stats";
import styles from "./ExperienceCard.module.css";

type AccentStyle = React.CSSProperties & { "--accent-opacity": string }

type ExperiencePosition = {
  title: string
  period: string
  description: string
}

type ExperienceCardProps = {
  company: string
  period: string
  tags: string[]
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
  logo,
  accentOpacity = "1",
  projectsHref,
  positions,
}: ExperienceCardProps) {
  const tagItems = tags.map((tag) => {
    const linkable = isFilterableStack(tag) && getProjectCountByStack(tag) > 0;
    return {
      tag,
      href: linkable ? `/projects?stackFilters=${encodeURIComponent(tag)}` : undefined,
      ariaLabel: linkable ? `See projects using ${tag}` : undefined,
    };
  });

  const logoNode = logo ?? (
    <div className={styles.logoFallback}>
      <span className="text-xs font-bold tracking-normal leading-none text-amber-foreground">
        {getInitials(company)}
      </span>
    </div>
  );
  const accentStyle: AccentStyle = { "--accent-opacity": accentOpacity };

  return (
    <div className={styles.card} style={accentStyle}>
      <div className="grid gap-4 p-[1.125rem]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{logoNode}</div>
          <div className="flex items-start justify-between gap-3 min-w-0 flex-1">
            <div className="min-w-0">
              <p className="m-0 text-foreground font-heading font-[750] leading-[1.25]">{company}</p>
              <p className="m-0 mt-[0.15rem] text-ghost-foreground text-xs leading-[1.3]">{period}</p>
            </div>
            {projectsHref && (
              <Link
                href={projectsHref}
                className="inline-flex items-center flex-shrink-0 gap-1 mt-0.5 text-amber text-xs leading-[1.2] whitespace-nowrap transition-colors duration-200 hover:text-amber-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px] focus-visible:rounded-[0.375rem] [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--amber-dark)_68%,transparent)] [html[data-theme=light]_&]:hover:text-[color-mix(in_srgb,var(--amber-dark)_82%,black)]"
              >
                View projects <ArrowRightIcon className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid">
          {positions.map((position, positionIndex) => (
            <div key={position.title} className="grid grid-cols-[16px_1fr] gap-x-[10px]">
              <div className="flex flex-col items-center pt-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-amber border border-amber flex-shrink-0 [html[data-theme=light]_&]:bg-amber/[16%] [html[data-theme=light]_&]:border-border-amber" />
                {positionIndex < positions.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={positionIndex < positions.length - 1 ? "min-w-0 pb-4" : "min-w-0"}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                  <p className="m-0 text-foreground text-sm font-semibold leading-[1.35]">{position.title}</p>
                  <span className="text-ghost-foreground text-xs leading-[1.2] whitespace-nowrap">{position.period}</span>
                </div>
                <ShowMoreText
                  text={position.description}
                  textClassName="mt-1 text-muted-foreground text-sm leading-[1.65]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tagItems.map(({ tag, href, ariaLabel }) => (
            <Tag key={tag} href={href} aria-label={ariaLabel}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
