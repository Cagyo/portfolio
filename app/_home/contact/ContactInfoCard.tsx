type ContactInfoCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

export function ContactInfoCard({ icon, label, value, href }: ContactInfoCardProps) {
  const content = (
    <>
      <div className="w-10 h-10 glass-amber rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
        <p className={`text-white font-medium ${href ? "group-hover:text-amber-400 transition-colors" : ""}`}>{value}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer group"
      >
        {content}
      </a>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-4 cursor-default">
      {content}
    </div>
  )
}
