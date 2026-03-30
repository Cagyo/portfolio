import type { ComponentPropsWithoutRef } from "react"
import styles from "./Button.module.css"

type BaseProps = {
  variant?: "primary" | "outline"
  className?: string
  children: React.ReactNode
}

type ButtonAsAnchor = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">
type ButtonAsButton = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>

type ButtonProps = ButtonAsAnchor | ButtonAsButton

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const variantClass = variant === "outline" ? styles.outline : styles.primary

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a href={href} className={`${variantClass} ${className}`} {...anchorRest}>
        <span className={styles.inner}>{children}</span>
      </a>
    )
  }

  const buttonRest = rest as ButtonAsButton
  return (
    <button className={`${variantClass} ${className}`} {...buttonRest}>
      <span className={styles.inner}>{children}</span>
    </button>
  )
}
