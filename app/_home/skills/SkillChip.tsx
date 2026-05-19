import Link from "next/link"
import { useTranslations } from "next-intl"
import { cva } from "class-variance-authority"
import { cn } from "@/app/_lib/cn"
import { isFilterableStack } from "@/app/_data/projects/get-stack-stats"

const chipStyles = cva(
  "inline-flex items-center gap-[5px] whitespace-nowrap motion-reduce:transition-none",
  {
    variants: {
      tier: {
        top: "px-[10px] py-[6px] rounded-[8px] bg-[var(--chip-top-bg)] border border-[var(--chip-top-border)] text-amber-foreground text-xs font-semibold cursor-default transition-[background-color,border-color,color,transform] duration-200 ease hover:bg-[var(--chip-top-bg-hover)] hover:border-[var(--chip-top-border-hover)]",
        rest: "px-[8px] py-[4px] rounded-[7px] bg-[var(--chip-rest-bg)] border border-[var(--chip-rest-border)] text-[color:var(--chip-rest-color)] text-[0.7rem] font-medium cursor-default transition-[background-color,border-color,color] duration-200 ease hover:bg-[var(--chip-rest-bg-hover)] hover:border-[var(--chip-rest-border-hover)] hover:text-[color:var(--chip-rest-color-hover)]",
      },
    },
    defaultVariants: { tier: "rest" },
  }
)

const chipLinkStyles =
  "cursor-pointer hover:-translate-y-px hover:border-[var(--amber)] focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2"

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

    const dot = <span className="size-1.5 rounded-full bg-amber flex-shrink-0" aria-hidden />

    const catBadge = (
      <span className="text-[0.56rem] font-bold tracking-[0.06em] uppercase px-1 py-px rounded bg-[var(--chip-cat-bg)] text-[color:var(--chip-cat-color)]">
        {category}
      </span>
    )

    if (linkable) {
      return (
        <Link
          href={`/projects?stackFilters=${encodeURIComponent(name)}`}
          className={cn(chipStyles({ tier: "top" }), chipLinkStyles)}
        >
          {dot}
          {name}
          {catBadge}
          <span
            className="inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-amber/18 text-amber text-[0.65rem] font-bold leading-none"
            aria-label={t("shipsAria", { count: projectCount })}
          >
            {projectCount}
          </span>
        </Link>
      )
    }

    return (
      <span className={chipStyles({ tier: "top" })}>
        {dot}
        {name}
        {catBadge}
      </span>
    )
  }

  return (
    <span className={chipStyles({ tier: "rest" })}>
      {name}
    </span>
  )
}
