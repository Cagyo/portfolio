import Image from "next/image";
import { StarRating } from "../../_components/StarRating";

export type SnippetTestimonial = {
  quotePreview: string
  authorName: string
  authorRole: string
  authorInitials: string
  authorPhoto?: string
}

type TestimonialSnippetProps = {
  testimonial: SnippetTestimonial
  /** sm = PhotoCard overlay (tighter sizes), md = HeroSection inline (larger) */
  size?: "sm" | "md"
  className?: string
}

export function TestimonialSnippet({ testimonial, size = "md", className = "" }: TestimonialSnippetProps) {
  const authorShort = `${testimonial.authorName.split(" ")[0]} ${testimonial.authorName.split(" ")[1]?.[0] ?? ""}.`
  const authorCompany = testimonial.authorRole.split("·")[1]?.trim() ?? ""
  const displayName = size === "sm" ? authorShort : testimonial.authorName

  const avatarSize = size === "sm" ? "w-6 h-6" : "w-7 h-7"
  const avatarRadius = size === "sm" ? "rounded-md" : "rounded-lg"
  const avatarPhotoSize = size === "sm" ? "24px" : "28px"
  const avatarInitialSize = size === "sm" ? "text-[9px]" : "text-[10px]"
  const authorGap = size === "sm" ? "gap-2" : "gap-2.5"
  const quoteSize = size === "sm" ? "text-[11px]" : "text-sm"
  const nameSize = size === "sm" ? "text-[10px]" : "text-xs"
  const companySize = size === "sm" ? "text-[9px]" : "text-[10px]"
  const starClassName = size === "sm" ? "w-3 h-3 text-amber-400" : "w-3.5 h-3.5 text-amber-400"

  return (
    <a
      href="#recommendations"
      className={`glass rounded-2xl p-4 hover:border-amber-500/20 transition-colors duration-200 cursor-pointer ${className}`}
    >
      <p className={`text-white/65 ${quoteSize} leading-relaxed italic line-clamp-2 mb-3`}>
        &ldquo;{testimonial.quotePreview}&rdquo;
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className={`flex items-center ${authorGap} min-w-0`}>
          {testimonial.authorPhoto ? (
            <div className={`${avatarSize} ${avatarRadius} overflow-hidden flex-shrink-0 relative`}>
              <Image
                src={testimonial.authorPhoto}
                alt={testimonial.authorName}
                fill
                className="object-cover"
                sizes={avatarPhotoSize}
              />
            </div>
          ) : (
            <div className={`${avatarSize} ${avatarRadius} bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center ${avatarInitialSize} font-black text-black flex-shrink-0`}>
              {testimonial.authorInitials}
            </div>
          )}
          <div className="min-w-0">
            <p className={`text-white/60 ${nameSize} font-semibold leading-none truncate`}>{displayName}</p>
            {authorCompany && (
              <p className={`text-white/35 ${companySize} mt-0.5 leading-none truncate`}>{authorCompany}</p>
            )}
          </div>
        </div>
        <StarRating starClassName={starClassName} />
      </div>
    </a>
  )
}
