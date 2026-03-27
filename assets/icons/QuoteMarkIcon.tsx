type IconProps = { className?: string }

export function QuoteMarkIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 32 32">
      <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.333C7.333 11.055 8.91 8 10 8zm14 0c-3.314 0-6 2.686-6 6v10h10V14h-6.667C21.333 11.055 22.91 8 24 8z" />
    </svg>
  )
}
