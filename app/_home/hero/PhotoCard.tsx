import Image from "next/image";
import styles from "./PhotoCard.module.css";
import { Tag } from "../../_components/tag/Tag";
import { TestimonialSnippet, type SnippetTestimonial } from "../recommendations/TestimonialSnippet";

const ENABLE_FLOAT_ANIMATION = false;

type PhotoCardProps = {
  availableLabel: string;
  testimonial?: SnippetTestimonial;
};

const TAGS = ["React", "Node.js", "TypeScript", "AWS"];

export function PhotoCard({ availableLabel, testimonial }: PhotoCardProps) {
  return (
    <div className={styles.wrapper}>
      {/* ── Floating "Available" badge ─── */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap ${ENABLE_FLOAT_ANIMATION ? "animate-float" : ""} flex items-center gap-2 glass rounded-full px-3.5 py-2 text-xs font-medium text-white/80 ${styles.badge}`}
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
        <TestimonialSnippet
          testimonial={testimonial}
          size="sm"
          className={`absolute bottom-3 left-2 right-2 z-20 ${ENABLE_FLOAT_ANIMATION ? "animate-float" : ""} ${styles.miniReview}`}
        />
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
