type IconProps = { className?: string; strokeWidth?: number }

export function ArrowLeftShortIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M5 11H19m-14 0l7-7m-7 7l7 7" />
    </svg>
  )
}
