type IconProps = { className?: string }

export function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.75 5.25a.75.75 0 00-1.5 0v13.5a.75.75 0 001.5 0V5.25zM18.75 12L7.5 5.25v13.5L18.75 12z" />
    </svg>
  )
}
