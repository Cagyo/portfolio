import 'server-only'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OG_TOKENS } from '@/app/_og/tokens'
import { siteConfig } from '@/app/_config/site-config'

export const size = { width: 1200, height: 630 } as const
export const contentType = 'image/png'

export type OgProps = {
  /** Short uppercase label, e.g. "PORTFOLIO". Soft cap ~20 chars. */
  eyebrow: string
  /** Headline, Archivo 700 88px. Soft cap 52 chars before overflow risk. */
  title: string
  /** Supporting line, Space Grotesk 400 28px. Soft cap 110 chars. */
  description: string
}

async function loadAsset(relativePath: string, kind: string): Promise<Buffer> {
  try {
    return await readFile(join(process.cwd(), relativePath))
  } catch (cause) {
    throw new Error(
      `[og-template] Missing ${kind} at ${relativePath}. ` +
        `Commit the file or adjust the path. Inner: ${(cause as Error).message}`,
    )
  }
}

type OgCardProps = OgProps & { avatarSrc: string }

function OgCard({ eyebrow, title, description, avatarSrc }: OgCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: OG_TOKENS.bgWash,
        backgroundColor: OG_TOKENS.bg,
        color: OG_TOKENS.textPrimary,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {/* Left column — typography */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 780,
          padding: 72,
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 8,
              height: 8,
              backgroundColor: OG_TOKENS.amber,
            }}
          />
          <div
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: OG_TOKENS.amberLight,
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* Headline + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontFamily: '"Archivo", sans-serif',
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 660,
              color: OG_TOKENS.textPrimary,
              letterSpacing: '-0.015em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.3,
              maxWidth: 640,
              color: OG_TOKENS.textSecondary,
            }}
          >
            {description}
          </div>
        </div>

        {/* Signature row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 4,
              height: 72,
              background: OG_TOKENS.gradientAmber,
              borderRadius: 2,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontFamily: '"Archivo", sans-serif',
                fontSize: 22,
                fontWeight: 500,
                color: OG_TOKENS.textPrimary,
              }}
            >
              {siteConfig.author.name}
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 18,
                fontWeight: 400,
                color: OG_TOKENS.textMuted,
              }}
            >
              {siteConfig.url.replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
      </div>

      {/* Right column — avatar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 420,
          height: '100%',
        }}
      >
        {/* Outer transparent padded container — prevents Satori bbox-clipping the glow */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 480,
            height: 480,
          }}
        >
          {/* Inner ring + glow */}
          <div
            style={{
              display: 'flex',
              width: 400,
              height: 400,
              borderRadius: 9999,
              border: `4px solid ${OG_TOKENS.amber}`,
              boxShadow: `0 0 80px rgba(245,158,11,0.35), ${OG_TOKENS.cardShadow}`,
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              width={400}
              height={400}
              alt=""
              style={{ borderRadius: 9999, display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function renderOg(props: OgProps): Promise<ImageResponse> {
  if (props.title.length > 52) {
    console.warn(`[og] title may overflow: "${props.title}" (${props.title.length} chars)`)
  }
  if (props.description.length > 110) {
    console.warn(
      `[og] description may overflow: "${props.description}" (${props.description.length} chars)`,
    )
  }

  const [archivoBold, archivoMedium, spaceGrotesk, avatarBuffer] = await Promise.all([
    loadAsset('assets/fonts/Archivo-Bold.ttf', 'font Archivo-Bold.ttf'),
    loadAsset('assets/fonts/Archivo-Medium.ttf', 'font Archivo-Medium.ttf'),
    loadAsset('assets/fonts/SpaceGrotesk-Regular.ttf', 'font SpaceGrotesk-Regular.ttf'),
    loadAsset('public/og/avatar.png', 'avatar'),
  ])

  const avatarSrc = `data:image/png;base64,${avatarBuffer.toString('base64')}`

  return new ImageResponse(<OgCard {...props} avatarSrc={avatarSrc} />, {
    ...size,
    fonts: [
      { name: 'Archivo', data: archivoBold, weight: 700, style: 'normal' },
      { name: 'Archivo', data: archivoMedium, weight: 500, style: 'normal' },
      { name: 'Space Grotesk', data: spaceGrotesk, weight: 400, style: 'normal' },
    ],
  })
}
