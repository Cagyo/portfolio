import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { Tag } from "@/app/_components/tag/Tag";
import { ProjectMeta } from "./ProjectMeta";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  title: string
  description: string
  problem?: string
  outcome?: string[]
  meta: { category: string; role: string; year: string }
  badge: { icon: React.ReactNode; label: string }
  tags: string[]
  imageBg: string
  imageContent: React.ReactNode
  linkOverlay: React.ReactNode
  featured?: boolean
  viewInProjectsHref: string
  viewInProjectsLabel: string
}

export function ProjectCard({
  title,
  description,
  problem,
  outcome,
  meta,
  badge,
  tags,
  imageBg,
  imageContent,
  linkOverlay,
  featured,
  viewInProjectsHref,
  viewInProjectsLabel,
}: ProjectCardProps) {
  const cardClassName = featured ? styles.featuredCard : styles.supportingCard;

  return (
    <article className={`${styles.projectCard} ${cardClassName} glass group reveal`}>
      <div className={`${styles.imageFrame} ${imageBg}`}>
        <div className={styles.imageContent}>
          {imageContent}
        </div>
        <div className={styles.projectOverlay}>
          {linkOverlay}
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.narrativeBlock}>
          <ProjectMeta {...meta} />
          <h3 className={styles.title}>
            <Link href={viewInProjectsHref} className={styles.titleLink}>
              {title}
            </Link>
          </h3>
          {problem && (
            <p className={styles.problemText}>{problem}</p>
          )}
          {!problem && (
            <p className={styles.descriptionText}>{description}</p>
          )}
        </div>
        <div className={styles.proofBlock}>
          {outcome && outcome.length > 0 && (
            <ul className={styles.outcomeList}>
              {outcome.map((item) => (
                <li key={item} className={styles.outcomeItem}>
                  <CheckIcon className={styles.outcomeIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.badge}>
            {badge.icon}
            <span className={styles.badgeText}>{badge.label}</span>
          </div>
          <div className={styles.tagList}>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className={styles.actionRow}>
            <Link href={viewInProjectsHref} className={styles.viewInProjectsLink} aria-hidden="true" tabIndex={-1}>
              {viewInProjectsLabel}
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
