type BlobTone = "amber" | "violet"
type BlobShade = 400 | 500 | 600 | 700 | 800
type BlobSize = "sm" | "md" | "lg"

const SIZE_CLASS = {
  sm: "w-64 h-64",
  md: "w-80 h-80",
  lg: "w-96 h-96",
} as const satisfies Record<BlobSize, string>

// Static table — every Tailwind class must be a literal so the JIT picks it up.
const COLOR_CLASS = {
  amber: {
    400: "bg-amber-400",
    500: "bg-amber-500",
    600: "bg-amber-600",
    700: "bg-amber-700",
    800: "bg-amber-800",
  },
  violet: {
    400: "bg-violet-400",
    500: "bg-violet-500",
    600: "bg-violet-600",
    700: "bg-violet-700",
    800: "bg-violet-800",
  },
} as const satisfies Record<BlobTone, Record<BlobShade, string>>

type BlobBackgroundProps = {
  /** Freeform Tailwind positioning (each call site is unique). */
  position: string
  size?: BlobSize
  tone?: BlobTone
  shade?: BlobShade
  opacity?: number
}

export function BlobBackground({
  position,
  size = "lg",
  tone = "amber",
  shade = 500,
  opacity,
}: BlobBackgroundProps) {
  const sizeClass = SIZE_CLASS[size];
  const colorClass = COLOR_CLASS[tone][shade];

  return (
    <div
      className={`blob ${sizeClass} ${colorClass} ${position}`}
      style={opacity !== undefined ? { opacity } : undefined}
    />
  );
}
