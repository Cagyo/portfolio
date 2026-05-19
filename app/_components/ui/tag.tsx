import Link from "next/link"
import { cn } from "@/app/_lib/cn"

type TagVariant = "amber" | "neutral" | "green"

type TagProps = {
  children: React.ReactNode
  href?: string
  "aria-label"?: string
  variant?: TagVariant
}

const baseStyles: Record<TagVariant, string> = {
  amber:
    "bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--tag-color)] text-[0.7rem] font-semibold tracking-[0.05em] uppercase px-2 py-[2px] rounded",
  neutral:
    "bg-card border border-[var(--input-border)] text-muted-foreground text-[0.65rem] font-semibold tracking-[0.04em] uppercase px-[7px] py-[2px] rounded-[5px]",
  green:
    "bg-[color-mix(in_srgb,var(--green)_10%,transparent)] border border-[color-mix(in_srgb,var(--green)_20%,transparent)] text-[var(--green-light)] text-[0.65rem] font-bold tracking-[0.05em] uppercase px-[7px] py-[2px] rounded-[5px]",
}

const linkHoverStyles: Record<TagVariant, string> = {
  amber:
    "hover:bg-[color-mix(in_srgb,var(--amber)_10%,transparent)] hover:border-[color-mix(in_srgb,var(--amber)_28%,transparent)] hover:text-amber",
  neutral: "hover:bg-card-hover hover:border-border hover:text-foreground-soft",
  green:
    "hover:bg-[color-mix(in_srgb,var(--green)_16%,transparent)] hover:border-[color-mix(in_srgb,var(--green)_35%,transparent)] hover:text-[var(--green-light)]",
}

export function Tag({ children, href, "aria-label": ariaLabel, variant = "amber" }: TagProps) {
  const staticCls = baseStyles[variant]

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          staticCls,
          "cursor-pointer inline-block no-underline transition-[background-color,border-color,color] duration-200 ease-[ease]",
          linkHoverStyles[variant]
        )}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    )
  }

  return <span className={staticCls}>{children}</span>
}
