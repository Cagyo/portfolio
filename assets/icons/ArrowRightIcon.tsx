type IconProps = { className?: string; strokeWidth?: number }

export function ArrowRightIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
