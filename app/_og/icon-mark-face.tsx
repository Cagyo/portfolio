import { OG_TOKENS } from '@/app/_og/tokens'

type IconMarkFaceProps = {
  size: number
}

const BORDER_RADIUS_RATIO = 0.1875
const FONT_FAMILY = '"Archivo", sans-serif'

const gradientTextStyle = {
  background: OG_TOKENS.gradientAmber,
  backgroundClip: 'text',
  color: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
} as const

export function IconMarkFace({ size }: IconMarkFaceProps) {
  const borderRadius = size * BORDER_RADIUS_RATIO
  const dotSize = size * 0.05

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius,
        backgroundColor: OG_TOKENS.bg,
      }}
    >
      <div
        style={{
          ...gradientTextStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_FAMILY,
          fontSize: size * 0.85,
          fontWeight: 900,
          lineHeight: 1,
          transform: 'rotate(-90deg)',
        }}
      >
        B
      </div>
      <div
        style={{
          position: 'absolute',
          width: dotSize,
          height: 2 * dotSize,
          borderRadius: dotSize / 1.5,
          backgroundColor: OG_TOKENS.green,
          top: size * 0.44,
          left: size * 0.37,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: dotSize,
          height: 2 * dotSize,
          borderRadius: dotSize / 1.5,
          backgroundColor: OG_TOKENS.green,
          top: size * 0.44,
          left: size * 0.59,
        }}
      />
    </div>
  )
}