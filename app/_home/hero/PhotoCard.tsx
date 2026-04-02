import Image from "next/image";
import styles from "./PhotoCard.module.css";
import { Tag } from "../../_components/tag/Tag";

const ENABLE_FLOAT_ANIMATION = false;

type TestimonialSnippet = {
  quote: string;
  authorName: string;
  authorRole: string;
};

type PhotoCardProps = {
  availableLabel: string;
  testimonial?: TestimonialSnippet;
};

const TAGS = ["React", "Node.js", "TypeScript", "AWS"];

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

export function PhotoCard({ availableLabel, testimonial }: PhotoCardProps) {
  const authorInitials = testimonial
    ? testimonial.authorName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
    : "";

  const authorShort = testimonial
    ? `${testimonial.authorName.split(" ")[0]} ${testimonial.authorName.split(" ")[1]?.[0] ?? ""}.`
    : "";

  const authorCompany = testimonial?.authorRole.split("·")[1]?.trim() ?? "";

  return (
    <div className={styles.wrapper}>
      {/* ── Floating "Available" badge ─── */}
      <div
        className={`absolute top-0 right-6 z-20 ${ENABLE_FLOAT_ANIMATION ? "animate-float" : ""} flex items-center gap-2 glass rounded-full px-3.5 py-2 text-xs font-medium text-white/80 ${styles.badge}`}
      >
        <span className={`w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 ${styles.availableDot}`} />
        {availableLabel}
      </div>

      {/* ── Main card ─── */}
      <div className={`${ENABLE_FLOAT_ANIMATION ? "animate-float" : ""} glass-amber rounded-3xl overflow-hidden ${styles.mainCard}`}>
        {/* Photo */}
        <div className={styles.photoArea}>
          <Image
            src="/assets/photo/main_photo.jpg"
            alt="Oleksii Berliziev"
            fill
            className="object-cover object-[50%_20%]"
            sizes="320px"
            priority
          />
        </div>

        {/* Tags */}
        <div className="px-6 py-4 flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>

      {/* ── Floating mini testimonial ─── */}
      {testimonial && (
        <div
          className={`absolute bottom-3 left-2 right-2 z-20 ${ENABLE_FLOAT_ANIMATION ? "animate-float" : ""} glass rounded-2xl p-4 ${styles.miniReview}`}
        >
          {/* Stars */}
          <div className="flex gap-0.5 mb-2.5">
            {[0, 1, 2, 3, 4].map((index) => (
              <svg
                key={index}
                className="w-3 h-3 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={STAR_PATH} />
              </svg>
            ))}
          </div>

          {/* Quote snippet */}
          <p className="text-white/65 text-[11px] leading-relaxed italic line-clamp-2">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[9px] font-black text-black flex-shrink-0">
              {authorInitials}
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-[10px] font-semibold leading-none truncate">{authorShort}</p>
              {authorCompany && (
                <p className="text-white/35 text-[9px] mt-0.5 leading-none truncate">{authorCompany}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Decorative dot grid ─── */}
      <div className={`absolute top-20 -right-1 z-0 ${styles.decorGrid}`} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex gap-2 mb-2">
            {[0, 1, 2].map((col) => (
              <div key={col} className="w-1 h-1 rounded-full bg-amber-400/20" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
