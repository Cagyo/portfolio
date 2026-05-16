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
      <span className={styles.logoInitials}>
        {getInitials(company)}
      </span>
    </div>
  );
  const accentStyle: AccentStyle = { "--accent-opacity": accentOpacity };

  return (
    <div className={styles.card} style={accentStyle}>
      <div className={styles.inner}>
        <div className={styles.companyHeader}>
          <div className={styles.logoSlot}>{logoNode}</div>
          <div className={styles.companyMeta}>
            <div className={styles.companyCopy}>
              <p className={styles.companyName}>{company}</p>
              <p className={styles.companyPeriod}>{period}</p>
            </div>
            {projectsHref && (
              <Link
                href={projectsHref}
                className={styles.projectsLink}
              >
                View projects <ArrowRightIcon className={styles.projectsLinkIcon} />
              </Link>
            )}
          </div>
        </div>

        <div className={styles.positionList}>
          {positions.map((position, positionIndex) => (
            <div key={position.title} className={styles.positionItem}>
              <div className={styles.track}>
                <div className={styles.dot} />
                {positionIndex < positions.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={positionIndex < positions.length - 1 ? styles.positionContentSpaced : styles.positionContent}>
                <div className={styles.positionHeader}>
                  <p className={styles.positionTitle}>{position.title}</p>
                  <span className={styles.positionPeriod}>{position.period}</span>
                </div>
                <ShowMoreText
                  text={position.description}
                  textClassName={styles.positionDescription}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tags}>
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
