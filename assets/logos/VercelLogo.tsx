type LogoProps = { className?: string }

export function VercelLogo({ className }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="white">
      <path d="M24 22.525H0L12 1.475z" />
    </svg>
  )
}
