'use client'

import { useMemo } from "react"
import { cn } from "@/app/_lib/cn"
import { useActiveSection } from "./use-active-section"

type NavLink = { label: string; href: string }

type NavLinksProps = {
  links: NavLink[]
  className?: string
}

export function NavLinks({ links, className = "" }: NavLinksProps) {
  const sectionIds = useMemo(() => links.map((link) => link.href.replace('#', '')), [links])
  const activeId = useActiveSection(sectionIds)

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "relative inline-flex items-center min-h-8 text-faint-foreground text-[0.8125rem] font-medium leading-none no-underline cursor-pointer transition-colors duration-200",
            "after:absolute after:bottom-[0.125rem] after:left-0 after:h-px after:w-0 after:bg-amber-foreground after:opacity-85 after:transition-[width] after:duration-[250ms] after:ease-[ease]",
            "hover:text-foreground focus-visible:text-foreground hover:after:w-full focus-visible:after:w-full",
            "focus-visible:outline-2 focus-visible:outline focus-visible:outline-[color-mix(in_srgb,var(--amber)_70%,transparent)] focus-visible:outline-offset-[0.375rem] focus-visible:rounded-md",
            link.href === `#${activeId}` && "text-foreground after:!w-full",
            className
          )}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
