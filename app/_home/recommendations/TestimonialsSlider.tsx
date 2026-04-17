"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
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

  return (
    <div className="w-full">
      {/* Card + arrows row */}
      <div className="relative">
        {/* Prev arrow */}
        {!isSingle && (
          <button
            onClick={goToPrev}
            aria-label="Previous testimonial"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-10 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer ${styles.arrowBtn}`}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        )}

        {/* Card — key forces remount → triggers CSS animation */}
        <div className={`max-w-2xl mx-auto ${styles.cardTransition}`} key={currentIndex}>
          <TestimonialCard
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
            linkedinUrl={item.linkedinUrl ?? "#"}
            viewOnLinkedInLabel={item.viewOnLinkedInLabel}
          />
        </div>

        {/* Next arrow */}
        {!isSingle && (
          <button
            onClick={goToNext}
            aria-label="Next testimonial"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-10 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-amber-400 hover:border-amber-500/30 transition-colors duration-200 cursor-pointer ${styles.arrowBtn}`}
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile swipe hint + dot indicators (hidden for single item) */}
      {!isSingle && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-6 h-2 bg-amber-400"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
