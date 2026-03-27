type IconProps = { className?: string }

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0 C8 0 8.6 3.6 10 5 C11.4 6.4 15 7 15 8 C15 8 11.4 8.6 10 10 C8.6 11.4 8 15 8 15 C8 15 7.4 11.4 6 10 C4.6 8.6 1 8 1 8 C1 8 4.6 7.4 6 6 C7.4 4.6 8 1 8 1 Z" />
    </svg>
  )
}
