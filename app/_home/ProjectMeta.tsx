import styles from "./ProjectMeta.module.css"

type ProjectMetaProps = {
  category: string
  role: string
  year: string
}

export function ProjectMeta({ category, role, year }: ProjectMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className={styles.projMetaChip}>{category}</span>
      <span className={styles.projMetaDot}>·</span>
      <span className={styles.projMetaChip}>{role}</span>
      <span className={styles.projMetaDot}>·</span>
      <span className={styles.projMetaChip}>{year}</span>
    </div>
  );
}
