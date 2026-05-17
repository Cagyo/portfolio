"use client";

import { useState } from "react";
import { ArrowLeftShortIcon } from "@/assets/icons/ArrowLeftShortIcon";
import { ArrowRightShortIcon } from "@/assets/icons/ArrowRightShortIcon";
import styles from "./TestimonialsSlider.module.css";
import { TestimonialCard } from "./TestimonialCard";

type SliderItem = {
  quotePreview: string;
  quoteRest?: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  gradientClass: string;
  initialsColor?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  viewOnLinkedInLabel: string;
  readMoreLabel: string;
  readLessLabel: string;
};

type TestimonialsSliderProps = {
  items: SliderItem[];
};

export function TestimonialsSlider({ items }: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSingle = items.length <= 1;

  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % items.length);

  const item = items[currentIndex];
  if (!item) return null;

  const cardVariant = isSingle ? "feature" : "carousel";

  return (
    <div className={styles.slider}>
      <div className={isSingle ? styles.singleFrame : styles.carouselFrame}>
        {!isSingle && (
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous testimonial"
            className={`${styles.arrowBtn} ${styles.arrowPrev}`}
          >
            <ArrowLeftShortIcon className="w-4 h-4" />
          </button>
        )}

        <div className={styles.cardTransition} key={currentIndex}>
          <TestimonialCard
            variant={cardVariant}
            quotePreview={item.quotePreview}
            quoteRest={item.quoteRest}
            readMoreLabel={item.readMoreLabel}
            readLessLabel={item.readLessLabel}
            author={{
              name: item.authorName,
              role: item.authorRole,
              initials: item.authorInitials,
              gradientClass: item.gradientClass,
              initialsColor: item.initialsColor,
              photoUrl: item.photoUrl,
            }}
            linkedinUrl={item.linkedinUrl}
            viewOnLinkedInLabel={item.viewOnLinkedInLabel}
          />
        </div>

        {!isSingle && (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next testimonial"
            className={`${styles.arrowBtn} ${styles.arrowNext}`}
          >
            <ArrowRightShortIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isSingle && (
        <div className={styles.dots}>
          {items.map((sliderItem, index) => (
            <button
              key={sliderItem.authorName}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
