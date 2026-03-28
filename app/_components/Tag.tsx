import styles from "./Tag.module.css"

type TagProps = {
  children: React.ReactNode
  variant?: "amber" | "neutral" | "green"
}

export function Tag({ children, variant = "amber" }: TagProps) {
  const cls = {
    amber: styles.tag,
    neutral: styles.tagNeutral,
    green: styles.tagGreen,
  }[variant];

  return <span className={cls}>{children}</span>;
}
