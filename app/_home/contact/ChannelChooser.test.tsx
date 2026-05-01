import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import messages from '@/messages/en.json'

vi.mock('server-only', () => ({}))

// Stub siteConfig — these URLs are gated off in production but the chooser
// must still render them when mounted in tests.
vi.mock('@/app/_config/site-config', () => ({
  siteConfig: {
    social: {
      telegram: { url: 'https://t.me/test-tg', handle: 'test-tg' },
      whatsapp: { url: 'https://wa.me/123456789', handle: '+1 234 567 89' },
    },
    calendly: { url: 'https://calendly.com/test/discovery' },
  },
}))

// Resolve next-intl's `getTranslations` against the real messages bundle.
vi.mock('next-intl/server', () => ({
  getTranslations: async (namespace: string) => {
    const dict = namespace
      .split('.')
      .reduce<Record<string, unknown> | undefined>(
        (acc, key) => (acc?.[key] as Record<string, unknown>),
        messages as Record<string, unknown>,
      )
    return (key: string) => {
      const value = key
        .split('.')
        .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], dict)
      return typeof value === 'string' ? value : key
    }
  },
}))

// Real TrackedLink uses `'use client'` + analytics — render it as a plain anchor in tests.
vi.mock('@/app/_components/tracked-link/TrackedLink', () => ({
  TrackedLink: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import { ChannelChooser } from './ChannelChooser'

describe('ChannelChooser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 3 anchors with hrefs from siteConfig and external link attributes', async () => {
    const ui = await ChannelChooser()
    render(ui)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    const hrefs = links.map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual([
      'https://t.me/test-tg',
      'https://wa.me/123456789',
      'https://calendly.com/test/discovery',
    ])

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders the eyebrow text from i18n', async () => {
    const ui = await ChannelChooser()
    render(ui)
    expect(screen.getByText(messages.contact.channels.eyebrow)).toBeInTheDocument()
  })
})
