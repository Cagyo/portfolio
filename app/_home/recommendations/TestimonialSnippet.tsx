import Image from "next/image";
import { StarRating } from "../../_components/StarRating";
import styles from "./TestimonialSnippet.module.css";

export type SnippetTestimonial = {
  quotePreview: string
  authorName: string
  authorRole: string
  authorInitials: string
  authorPhoto?: string
}

type TestimonialSize = "sm" | "md"

type TestimonialSnippetProps = {
  testimonial: SnippetTestimonial
  /** sm = PhotoCard overlay (tighter sizes), md = HeroSection inline (larger) */
  size?: TestimonialSize
  className?: string
}

const VARIANTS: Record<TestimonialSize, {
  avatar: string
  radius: string
  photoSize: string
  initial: string
  gap: string
  quote: string
  name: string
  company: string
  star: string
}> = {
  sm: {
    avatar: "w-6 h-6",
    radius: "rounded-md",
    photoSize: "24px",
    initial: styles.initialSm,
    gap: "gap-2",
    quote: styles.quoteSm,
    name: styles.nameSm,
    company: styles.companySm,
    star: "w-3 h-3 text-amber-400",
  },
  md: {
    avatar: "w-7 h-7",
    radius: "rounded-lg",
    photoSize: "28px",
    initial: styles.initialMd,
    gap: "gap-2.5",
    quote: styles.quoteMd,
    name: styles.nameMd,
    company: styles.companyMd,
    star: "w-3.5 h-3.5 text-amber-400",
  },
}

export function TestimonialSnippet({ testimonial, size = "md", className = "" }: TestimonialSnippetProps) {
  const authorShort = `${testimonial.authorName.split(" ")[0]} ${testimonial.authorName.split(" ")[1]?.[0] ?? ""}.`
  const authorCompany = testimonial.authorRole.split("·")[1]?.trim() ?? ""
  const displayName = size === "sm" ? authorShort : testimonial.authorName
  const variant = VARIANTS[size]

  return (
    <a
      href="#recommendations"
      className={`glass rounded-2xl p-4 hover:border-amber-500/20 transition-colors duration-200 cursor-pointer ${className}`}
    >
      <p className={`text-white/65 ${variant.quote} leading-relaxed italic line-clamp-2 mb-3`}>
        &ldquo;{testimonial.quotePreview}&rdquo;
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className={`flex items-center ${variant.gap} min-w-0`}>
          {testimonial.authorPhoto ? (
            <div className={`${variant.avatar} ${variant.radius} overflow-hidden flex-shrink-0 relative`}>
              <Image
                src={testimonial.authorPhoto}
                alt={testimonial.authorName}
                fill
                className="object-cover"
                sizes={variant.photoSize}
              />
            </div>
          ) : (
            <div className={`${variant.avatar} ${variant.radius} bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center ${variant.initial} font-black text-black flex-shrink-0`}>
              {testimonial.authorInitials}
            </div>
          )}
          <div className="min-w-0">
            <p className={`text-white/60 ${variant.name} font-semibold leading-none truncate`}>{displayName}</p>
            {authorCompany && (
              <p className={`text-white/35 ${variant.company} mt-0.5 leading-none truncate`}>{authorCompany}</p>
            )}
          </div>
        </div>
        <StarRating starClassName={variant.star} />
      </div>
    </a>
  )
}
