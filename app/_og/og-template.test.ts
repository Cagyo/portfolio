import { describe, it, expect, vi } from 'vitest'

vi.mock('next/og', () => ({
  ImageResponse: vi.fn(function (this: Record<string, unknown>, element: unknown, options: unknown) {
    this.element = element
    this.options = options
    this.type = 'mocked-image-response'
  }),
}))

describe('OG template', () => {
  it('exports the expected size and contentType', async () => {
    const mod = await import('./og-template')
    expect(mod.size).toEqual({ width: 1200, height: 630 })
    expect(mod.contentType).toBe('image/png')
  })

  it('renderOg calls ImageResponse with fonts and our JSX', async () => {
    const { renderOg } = await import('./og-template')
    const { ImageResponse } = await import('next/og')
    await renderOg({ eyebrow: 'TEST', title: 'Test', description: 'Test desc' })
    expect(ImageResponse).toHaveBeenCalledOnce()
    const [, options] = vi.mocked(ImageResponse).mock.calls[0] as [
      unknown,
      { fonts: unknown[]; width: number; height: number },
    ]
    expect(options.fonts).toHaveLength(3)
    expect(options.width).toBe(1200)
    expect(options.height).toBe(630)
  })

  it('OG_TOKENS amber values match globals.css (drift guard)', async () => {
    const { OG_TOKENS } = await import('./tokens')
    expect(OG_TOKENS.amber).toBe('#F59E0B')
    expect(OG_TOKENS.amberLight).toBe('#FBBF24')
    expect(OG_TOKENS.amberDark).toBe('#D97706')
    expect(OG_TOKENS.bg).toBe('#080810')
    expect(OG_TOKENS.bgSecondary).toBe('#0c0c18')
    expect(OG_TOKENS.textPrimary).toBe('#F8FAFC')
    expect(OG_TOKENS.textSecondary).toBe('rgba(248,250,252,0.70)')
    expect(OG_TOKENS.textMuted).toBe('rgba(248,250,252,0.50)')
    expect(OG_TOKENS.cardShadow).toBe('0 20px 60px rgba(245,158,11,0.15)')
  })
})
