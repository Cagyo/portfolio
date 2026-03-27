type IconProps = { className?: string; strokeWidth?: number }

export function ArrowLeftIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M19 11H5m14 0l-7-7m7 7l-7 7" />
    </svg>
  )
}
