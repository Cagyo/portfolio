'use client'

import styles from "./NavLinks.module.css"
import { useActiveSection } from "./use-active-section"
import { useMemo } from "react"

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
          className={`${styles.navLink} text-sm text-white/70 hover:text-white font-medium cursor-pointer ${link.href === `#${activeId}` ? styles.active : ''} ${className}`}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
