import { cn } from "@/app/_lib/cn"

type ContactInfoCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

const cardBase =
  "flex items-center gap-3 p-3 rounded-[0.875rem] text-foreground " +
  "bg-foreground/3 border border-border";

const linkExtra =
  "cursor-pointer transition-[border-color,background] duration-[180ms] ease-[ease] " +
  "hover:bg-foreground/5 hover:border-border-amber " +
  "[html[data-theme=light]_&]:bg-card [html[data-theme=light]_&]:hover:bg-card-hover [html[data-theme=light]_&]:hover:border-border-amber";

export function ContactInfoCard({ icon, label, value, href }: ContactInfoCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-center w-8 h-8 rounded-[0.625rem] bg-amber/9 border border-amber/18 shrink-0 [html[data-theme=light]_&]:bg-amber/8 [html[data-theme=light]_&]:border-border-amber">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-faint-foreground text-[0.6875rem] font-bold tracking-[0.12em] uppercase leading-[1.2]">{label}</p>
        <p className={cn(
          "text-foreground text-[0.9375rem] font-semibold leading-[1.35] mt-0.5 break-words",
          href && "group-hover/card:text-amber-foreground transition-colors duration-[180ms] [html[data-theme=light]_&]:group-hover/card:text-[var(--tag-color)]",
        )}>
          {value}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn("group/card", cardBase, linkExtra)}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={cardBase}>
      {content}
    </div>
  )
}
