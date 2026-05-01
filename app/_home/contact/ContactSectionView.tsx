'use client'

import { useEffect, useRef } from 'react'
import { trackContactSectionView } from '@/app/_analytics/analytics'

/**
 * Fires `contact_section_view` once per mount when the #contact section
 * crosses 40% visibility. Renders nothing — exists purely to host the
 * IntersectionObserver inside the Server `ContactSection`.
 */
export function ContactSectionView() {
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (hasFiredRef.current) return

    const target = document.getElementById('contact')
    if (!target) return

    if (typeof IntersectionObserver === 'undefined') {
      trackContactSectionView()
      hasFiredRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasFiredRef.current) {
            trackContactSectionView()
            hasFiredRef.current = true
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return null
}
