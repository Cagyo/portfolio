type IconProps = { className?: string; strokeWidth?: number; fillOpacity?: number }

export function GolfFlagIcon({ className, strokeWidth = 2, fillOpacity = 0.3 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <line x1="8" y1="3" x2="8" y2="21" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 3 L20 8 L8 14 Z" fill="currentColor" stroke="none" opacity={fillOpacity} />
    </svg>
  )
}
