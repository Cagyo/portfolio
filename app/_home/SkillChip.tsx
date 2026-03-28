import styles from "./SkillChip.module.css"

type SkillChipProps = {
  name: string
  category: string
  variant: "top" | "rest"
}

export function SkillChip({ name, category, variant }: SkillChipProps) {
  if (variant === "top") {
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
      <span className={styles.skillChipCat}>{category}</span>
    </span>
  );
}
