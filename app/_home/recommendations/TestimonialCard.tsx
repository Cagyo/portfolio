"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { QuoteMarkIcon } from "@/assets/icons/QuoteMarkIcon";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import { cn } from "@/app/_lib/cn";

type TestimonialCardProps = {
  variant?: "feature" | "carousel";
  quotePreview: string;
  quoteRest?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
  author: {
    name: string;
    role: string;
    initials: string;
    gradientClass: string;
    initialsColor?: string;
    photoUrl?: string;
  };
  linkedinUrl?: string;
  viewOnLinkedInLabel: string;
};

export function TestimonialCard({
  variant = "carousel",
  quotePreview,
  quoteRest,
  readMoreLabel,
  readLessLabel,
  author,
  linkedinUrl,
  viewOnLinkedInLabel,
}: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = !!quoteRest;

  const previewParagraphs = quotePreview.split("\n\n");
  const fullParagraphs = hasMore
    ? (quotePreview + quoteRest).split("\n\n")
    : previewParagraphs;
  const paragraphs = expanded ? fullParagraphs : previewParagraphs;
  const isFeature = variant === "feature";

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg cursor-default transition-[border-color] duration-300 hover:border-border-amber",
        "flex flex-col",
        isFeature
          ? "gap-[clamp(1.25rem,3vw,2rem)] p-[clamp(1.5rem,4vw,3rem)]"
          : "gap-6 p-7",
      )}
    >
      {/* ── Meta panel (author + LinkedIn link) ── */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          {author.photoUrl ? (
            <div className="rounded-lg shrink-0 h-10 w-10 overflow-hidden">
              <Image
                src={author.photoUrl}
                alt={author.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className={cn(
                "rounded-lg shrink-0 h-10 w-10 overflow-hidden flex items-center justify-content-center font-heading text-sm font-black",
                author.gradientClass,
              )}
            >
              <span className={author.initialsColor ?? "text-black"}>
                {author.initials}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="m-0 text-foreground text-sm font-semibold">{author.name}</p>
            <p className="m-0 text-faint-foreground text-xs leading-[1.45]">{author.role}</p>
          </div>
        </div>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            aria-label={viewOnLinkedInLabel}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/li inline-flex items-center gap-1.5 shrink-0 text-ghost-foreground text-xs leading-none no-underline cursor-pointer",
              "transition-colors duration-200 hover:text-[var(--linkedin-blue)]",
              "focus-visible:rounded focus-visible:outline-2 focus-visible:outline-amber-light focus-visible:outline-offset-[3px]",
            )}
          >
            <LinkedInLogo
              className="h-4 w-4 text-[color-mix(in_srgb,var(--linkedin-blue)_50%,transparent)] transition-colors duration-200 group-hover/li:text-[var(--linkedin-blue)]"
            />
            <span className="max-[520px]:hidden">{viewOnLinkedInLabel}</span>
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        )}
      </div>
      {/* ── Quote panel ── */}
      <div className="flex flex-col gap-5 min-w-0">
        <QuoteMarkIcon
          className={cn(
            "shrink-0 text-amber-light/30 [html[data-theme=light]_&]:text-[color-mix(in_srgb,var(--amber-dark)_24%,transparent)]",
            isFeature ? "h-10 w-10" : "h-8 w-8",
          )}
        />
        <div
          className={cn(
            "text-foreground-soft flex flex-1 flex-col gap-3 italic leading-[1.7]",
            isFeature
              ? "text-[clamp(1.05rem,0.98rem+0.25vw,1.18rem)] leading-[1.75]"
              : "text-base",
          )}
        >
          {paragraphs.map((paragraph, index) => {
            const isFirst = index === 0;
            const isLast = index === paragraphs.length - 1;
            const stableKey = paragraph.slice(0, 40);
            const showReadMore = !expanded && hasMore && isLast;

            return (
              <p key={stableKey} className="m-0">
                {isFirst && "\u201C"}
                {paragraph}
                {showReadMore && (
                  <>
                    {" "}
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setExpanded(true)}
                      className={cn(
                        "cursor-pointer not-italic transition-colors duration-200 text-amber-light underline underline-offset-[2px]",
                        "hover:text-[color-mix(in_srgb,var(--amber-light)_78%,white)]",
                        "[html[data-theme=light]_&]:text-[var(--tag-color)]",
                        "[html[data-theme=light]_&]:hover:text-[color-mix(in_srgb,var(--amber-dark)_80%,black)]",
                        "focus-visible:rounded focus-visible:outline-2 focus-visible:outline-amber-light focus-visible:outline-offset-[3px]",
                      )}
                    >
                      {readMoreLabel ?? "Read more"}
                    </button>
                  </>
                )}
                {!showReadMore && isLast && "\u201D"}
              </p>
            );
          })}
          {expanded && hasMore && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(false)}
              className={cn(
                "self-start cursor-pointer not-italic text-faint-foreground text-sm transition-colors duration-200",
                "hover:text-amber-light",
                "[html[data-theme=light]_&]:text-muted-foreground",
                "[html[data-theme=light]_&]:hover:text-[var(--tag-color)]",
                "focus-visible:rounded focus-visible:outline-2 focus-visible:outline-amber-light focus-visible:outline-offset-[3px]",
              )}
            >
              {readLessLabel ?? "Read less"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
