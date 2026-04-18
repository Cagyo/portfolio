import Link from 'next/link'
import type { Interest } from '../contact/contact-types'

type EngagementCtaProps = {
  text: string
  interest: Interest
  className?: string
}

export function EngagementCta({ text, interest, className }: EngagementCtaProps) {
  return (
    <Link href={`?interest=${interest}#contact`} className={className}>
      {text}
    </Link>
  )
}
