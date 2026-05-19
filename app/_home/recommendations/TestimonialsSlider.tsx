"use client";

import { useState } from "react";
import { ArrowLeftShortIcon } from "@/assets/icons/ArrowLeftShortIcon";
import { ArrowRightShortIcon } from "@/assets/icons/ArrowRightShortIcon";
import { cn } from "@/app/_lib/cn";
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

const arrowBtnBase =
  "absolute top-1/2 -translate-y-1/2 z-[1] flex h-10 w-10 items-center justify-center rounded-full " +
  "bg-card border border-border text-faint-foreground cursor-pointer " +
  "transition-[background-color,border-color,color] duration-200 " +
  "hover:bg-amber/10 hover:border-border-amber hover:text-amber-light " +
  "[html[data-theme=light]_&]:hover:bg-amber/8 [html[data-theme=light]_&]:hover:text-[var(--tag-color)] " +
  "focus-visible:outline-2 focus-visible:outline-amber-light focus-visible:outline-offset-[3px] " +
  "max-md:hidden";

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
    <div className="w-full">
      <div
        className={cn(
          "mx-auto relative",
          isSingle ? "max-w-4xl" : "max-w-[42rem]",
        )}
      >
        {!isSingle && (
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous testimonial"
            className={cn(arrowBtnBase, "-left-14")}
          >
            <ArrowLeftShortIcon className="w-4 h-4" />
          </button>
        )}

        <div className="animate-slide-fade-in motion-reduce:animate-none" key={currentIndex}>
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
            className={cn(arrowBtnBase, "-right-14")}
          >
            <ArrowRightShortIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isSingle && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {items.map((sliderItem, index) => (
            <button
              key={sliderItem.authorName}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-pressed={index === currentIndex}
              className={cn(
                "flex h-3 w-6 items-center justify-center rounded-full border-0 bg-transparent p-0 cursor-pointer",
                "before:content-[''] before:block before:h-2 before:w-2 before:rounded-[inherit]",
                "before:opacity-[0.76] before:scale-x-100",
                "before:bg-foreground/20 [html[data-theme=light]_&]:before:bg-foreground/[0.16]",
                "before:transition-[background-color,opacity,transform] before:duration-300",
                "hover:before:bg-foreground/40 hover:before:opacity-100",
                "[html[data-theme=light]_&]:hover:before:bg-foreground/[0.28]",
                "aria-pressed:before:bg-amber-light aria-pressed:before:opacity-100 aria-pressed:before:scale-x-[2.8]",
                "[html[data-theme=light]_&]:aria-pressed:before:bg-[var(--tag-color)]",
                "focus-visible:outline-2 focus-visible:outline-amber-light focus-visible:outline-offset-[3px]",
                "motion-reduce:before:transition-none",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
