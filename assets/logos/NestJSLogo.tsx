type LogoProps = { className?: string }

export function NestJSLogo({ className }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.131.047c-.173 0-.334.014-.48.046l-9.404 2.18a1.539 1.539 0 0 0-1.246 1.523v14.5a1.54 1.54 0 0 0 1.246 1.523l9.404 2.18c.146.032.307.046.48.046.736 0 1.39-.462 1.39-1.523V1.57c0-1.06-.654-1.523-1.39-1.523M2.99 6.28H12.8v.8H2.99zM2.99 17v-.8h9.81v.8z" />
    </svg>
  )
}
