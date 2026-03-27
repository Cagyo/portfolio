type NavLink = { label: string; href: string }

type NavLinksProps = {
  links: NavLink[]
  className?: string
}

export function NavLinks({ links, className = "" }: NavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`nav-link text-sm text-white/70 hover:text-white font-medium cursor-pointer ${className}`}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
