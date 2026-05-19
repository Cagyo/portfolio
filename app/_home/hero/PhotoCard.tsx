import Image from "next/image";
import { HeroSkillChips } from "./HeroSkillChips";
import { TestimonialSnippet, type SnippetTestimonial } from "@/app/_home/recommendations/TestimonialSnippet";

type PhotoCardProps = {
  availableLabel: string;
  testimonial?: SnippetTestimonial;
};

export function PhotoCard({ availableLabel, testimonial }: PhotoCardProps) {
  return (
    <div className="relative w-[22rem] pt-8 pb-36">
      {/* Available badge */}
      <div className="absolute top-0 left-1/2 z-20 inline-flex items-center gap-2 -translate-x-1/2 px-[0.875rem] py-2 border border-border rounded-full bg-[color-mix(in_srgb,var(--bg-secondary)_88%,transparent)] backdrop-blur-[8px] text-foreground-soft text-xs font-semibold leading-none whitespace-nowrap shadow-[0_10px_28px_color-mix(in_srgb,var(--bg)_48%,transparent),0_0_0_1px_color-mix(in_srgb,var(--text-primary)_5%,transparent)] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] [html[data-theme=light]_&]:shadow-[0_12px_30px_color-mix(in_srgb,var(--text-primary)_8%,transparent),0_0_0_1px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]">
        <span className="w-2 h-2 shrink-0 rounded-full bg-[var(--green-light)] shadow-[0_0_8px_color-mix(in_srgb,var(--green-light)_70%,transparent)]" />
        {availableLabel}
      </div>

      <div className="glass-amber relative z-10 overflow-hidden rounded-[1.375rem] shadow-[var(--card-shadow)] [html[data-theme=light]_&]:shadow-[0_20px_60px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]">
        <div className="relative overflow-hidden w-full h-[22rem]">
          <Image
            src="/assets/photo/main_photo.jpg"
            alt="Oleksii Berliziev"
            fill
            className="object-cover object-[50%_20%]"
            sizes="352px"
            priority
          />
        </div>

        <div className="px-5 pt-4 pb-[1.125rem]">
          <HeroSkillChips />
        </div>
      </div>

      {testimonial && (
        <TestimonialSnippet
          testimonial={testimonial}
          size="sm"
          className="absolute right-3 bottom-3 left-3 z-20 shadow-[0_16px_42px_color-mix(in_srgb,var(--bg)_55%,transparent),0_0_0_1px_color-mix(in_srgb,var(--text-primary)_5%,transparent)] [html[data-theme=light]_&]:shadow-[0_14px_38px_color-mix(in_srgb,var(--text-primary)_10%,transparent),0_0_0_1px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]"
        />
      )}
    </div>
  );
}
