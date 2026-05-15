import Image from "next/image";
import styles from "./PhotoCard.module.css";
import { HeroSkillChips } from "./HeroSkillChips";
import { TestimonialSnippet, type SnippetTestimonial } from "@/app/_home/recommendations/TestimonialSnippet";

type PhotoCardProps = {
  availableLabel: string;
  testimonial?: SnippetTestimonial;
};

export function PhotoCard({ availableLabel, testimonial }: PhotoCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.badge}>
        <span className={styles.availableDot} />
        {availableLabel}
      </div>

      <div className={`glass-amber ${styles.mainCard}`}>
        <div className={styles.photoArea}>
          <Image
            src="/assets/photo/main_photo.jpg"
            alt="Oleksii Berliziev"
            fill
            className="object-cover object-[50%_20%]"
            sizes="352px"
            priority
          />
        </div>

        <div className={styles.skillRail}>
          <HeroSkillChips />
        </div>
      </div>

      {testimonial && (
        <TestimonialSnippet
          testimonial={testimonial}
          size="sm"
          className={styles.miniReview}
        />
      )}
    </div>
  );
}
