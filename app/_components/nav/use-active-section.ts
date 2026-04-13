'use client'

import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryA.boundingClientRect.top - entryB.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -30% 0px', threshold: 0 }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
