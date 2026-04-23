import Link from "next/link"
import { useTranslations } from "next-intl"
import { isFilterableStack } from "@/app/_data/projects/get-stack-stats"
import styles from "./SkillChip.module.css"

type SkillChipProps = {
  name: string
  category: string
  variant: "top" | "rest"
  projectCount?: number
}

export function SkillChip({ name, category, variant, projectCount }: SkillChipProps) {
  const t = useTranslations("skills")

  if (variant === "top") {
    const linkable = isFilterableStack(name) && typeof projectCount === "number" && projectCount > 0

    if (linkable) {
      return (
        <Link
          href={`/projects?stackFilters=${encodeURIComponent(name)}`}
          className={`${styles.skillChipTop} ${styles.skillChipTopLink}`}
        >
          <span className={styles.chipDot} />
          {name}
          <span className={styles.skillChipCat}>{category}</span>
          <span
            className={styles.shipsBadge}
            aria-label={t("shipsAria", { count: projectCount })}
          >
            {projectCount}
          </span>
        </Link>
      );
    }

    return (
      <span className={styles.skillChipTop}>
        <span className={styles.chipDot} />
        {name}
        <span className={styles.skillChipCat}>{category}</span>
      </span>
    );
  }

  return (
    <span className={styles.skillChipRest}>
      {name}
    </span>
  );
}
