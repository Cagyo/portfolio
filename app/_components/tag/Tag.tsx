import Link from "next/link"
import styles from "./Tag.module.css"

type TagProps = {
  children: React.ReactNode
  href?: string
  "aria-label"?: string
  variant?: "amber" | "neutral" | "green"
}

export function Tag({ children, href, "aria-label": ariaLabel, variant = "amber" }: TagProps) {
  const className = {
    amber: styles.tag,
    neutral: styles.tagNeutral,
    green: styles.tagGreen,
  }[variant];

  if (href) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}
