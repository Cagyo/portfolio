type LogoProps = { className?: string }

export function GooglePlayLogo({ className }: LogoProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3.18 23.76a2.07 2.07 0 001.94-.21l.06-.04L14 18l-3.07-3.07-7.75 8.83zM20.07 9.6L17.2 8l-3.43 3.43 3.43 3.43 2.9-1.62a2.08 2.08 0 000-3.64zM1.56.48a2.06 2.06 0 00-.35 1.15v20.74c0 .42.12.8.35 1.15L10.93 12 1.56.48zm9.37 9.52L3.12.24a2.06 2.06 0 011.94.21l.06.04L14 6 10.93 10z" />
    </svg>
  )
}
