/**
 * sections — single source of truth for page render order, nav visibility, and numbering.
 *
 * id        — matches the HTML `id` on the section element
 * enabled   — false hides the section from the page AND from the nav
 * numbered  — whether the section renders with a SectionHeader number (01., 02., ...).
 *             Numbering is dynamic: it follows the enabled-section render order.
 * navKey    — translation key under `nav.links.*`; omit for sections with no nav link
 */
type SectionEntry = {
  id: string
  enabled: boolean
  numbered?: boolean
  navKey?: string
}

const sections: SectionEntry[] = [
  { id: 'about',           enabled: true, numbered: true, navKey: 'about' },
  { id: 'projects',        enabled: true, numbered: true, navKey: 'projects' },
  { id: 'skills',          enabled: true, numbered: true, navKey: 'skills' },
  { id: 'recommendations', enabled: true, numbered: true, navKey: 'reviews' },
  { id: 'engagement',      enabled: true, numbered: true, navKey: 'services' },
  { id: 'fit',             enabled: true, numbered: true, navKey: 'fit' },
  { id: 'contact',         enabled: true, numbered: true, navKey: 'contact' },
  { id: 'mentorship-teaser', enabled: true },
]

export const siteConfig = {
  social: {
    github:   { url: 'https://github.com/cagyo', handle: 'cagyo' },
    linkedin: { url: 'https://www.linkedin.com/in/oleksii-berliziev/', handle: 'oleksii-berliziev' },
    // TODO: populate real X/Twitter URL
    twitter:  { url: '', handle: '' },
  },
  // TODO: populate real Calendly URL
  calendly: {
    url: '#',
  },
  resume: {
    url: '/cv/Oleksii_Berliziev_CV.pdf',
  },
  author: {
    name: 'Oleksii Berliziev',
    email: '',
  },
  ui: {
    experienceInitialVisible: 2,
  },
  turnstile: {
    /**
     * Controls the Cloudflare Turnstile widget rendering mode.
     * 'invisible' — silent background challenge (no visible widget)
     * 'compact'   — small visible checkbox
     * 'normal'    — full-size "I'm not a robot" checkbox
     */
    size: 'normal' as 'invisible' | 'compact' | 'normal',
  },
  sections,
} as const
