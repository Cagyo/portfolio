import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/_lib/cn"

export const buttonStyles = cva(
  "hover-transitions inline-flex items-center justify-center rounded-lg text-sm font-semibold",
  {
    variants: {
      variant: {
        primary: [
          "bg-[linear-gradient(135deg,var(--amber),var(--amber-dark))] text-[#0D0D0D]",
          "border border-transparent relative overflow-hidden",
          "hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--amber)_40%,transparent)]",
          "btn-shimmer",
        ],
        outline: [
          "border border-border-amber text-amber",
          "hover:bg-amber/10 hover:border-amber",
          "btn-outline",
        ],
      },
    },
    defaultVariants: { variant: "primary" },
  }
)

type BaseProps = {
  variant?: "primary" | "outline"
  className?: string
  children: React.ReactNode
} & VariantProps<typeof buttonStyles>

type ButtonAsAnchor = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">
type ButtonAsButton = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>

type ButtonProps = ButtonAsAnchor | ButtonAsButton

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const cls = cn(buttonStyles({ variant }), className)

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a href={href} className={cls} {...anchorRest}>
        <span className="relative z-10 inline-flex items-center justify-center gap-[inherit] flex-1">
          {children}
        </span>
      </a>
    )
  }

  const buttonRest = rest as ButtonAsButton
  return (
    <button className={cls} {...buttonRest}>
      <span className="relative z-10 inline-flex items-center justify-center gap-[inherit] flex-1">
        {children}
      </span>
    </button>
  )
}
