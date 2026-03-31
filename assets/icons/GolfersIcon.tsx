type IconProps = { className?: string }

export function GolfersIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 80 48">
      {/* Golfer 1 (smaller, left) — mid-swing */}
      <ellipse cx="18" cy="10" rx="5" ry="5" />
      <line x1="18" y1="15" x2="18" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="30" x2="10" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="30" x2="26" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="20" x2="8" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="20" x2="28" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Golfer 2 (larger, right) — address position */}
      <ellipse cx="60" cy="8" rx="6" ry="6" />
      <line x1="60" y1="14" x2="60" y2="33" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="60" y1="33" x2="50" y2="47" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="33" x2="70" y2="47" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="21" x2="48" y2="27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="21" x2="68" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
