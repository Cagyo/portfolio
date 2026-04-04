"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { QuoteMarkIcon } from "../../../assets/icons/QuoteMarkIcon";
import { LinkedInLogo } from "../../../assets/logos/LinkedInLogo";

type TestimonialCardProps = {
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
  delay?: string;
  viewOnLinkedInLabel: string;
};

export function TestimonialCard({ quotePreview, quoteRest, readMoreLabel, readLessLabel, author, linkedinUrl, delay, viewOnLinkedInLabel }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = !!quoteRest;

  const previewParagraphs = quotePreview.split("\n\n");
  const fullParagraphs = hasMore ? (quotePreview + quoteRest).split("\n\n") : previewParagraphs;
  const paragraphs = expanded ? fullParagraphs : previewParagraphs;

  return (
    <div
      className="reveal glass rounded-2xl p-7 flex flex-col gap-6 hover:border-amber-500/20 transition-colors duration-300 cursor-default"
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <QuoteMarkIcon className="w-8 h-8 text-amber-500/30 flex-shrink-0" />
      <div className="text-white/70 text-base leading-relaxed flex-1 italic flex flex-col gap-3">
        {paragraphs.map((paragraph, index) => {
          const isFirst = index === 0;
          const isLast = index === paragraphs.length - 1;

          if (!expanded && hasMore && isLast) {
            return (
              <p key={index}>
                {isFirst && "\u201C"}{paragraph}{" "}
                <button
                  onClick={() => setExpanded(true)}
                  className="not-italic text-amber-400 hover:text-amber-300 transition-colors duration-200 underline underline-offset-2 cursor-pointer"
                >
                  {readMoreLabel ?? "Read more"}
                </button>
              </p>
            );
          }

          return (
            <p key={index}>
              {isFirst && "\u201C"}{paragraph}{isLast && "\u201D"}
            </p>
          );
        })}
        {expanded && hasMore && (
          <button
            onClick={() => setExpanded(false)}
            className="not-italic text-white/30 hover:text-amber-400 transition-colors duration-200 text-sm cursor-pointer self-start"
          >
            {readLessLabel ?? "Read less"}
          </button>
        )}
      </div>
      <div className="h-px bg-white/6" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {author.photoUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={author.photoUrl}
                alt={author.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl ${author.gradientClass} flex items-center justify-center font-heading font-black text-sm flex-shrink-0`}>
              <span className={author.initialsColor ?? "text-black"}>{author.initials}</span>
            </div>
          )}
          <div>
            <p className="text-white font-semibold text-sm">{author.name}</p>
            <p className="text-white/40 text-xs">{author.role}</p>
          </div>
        </div>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            aria-label={viewOnLinkedInLabel}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-[#0A66C2] transition-colors duration-200 cursor-pointer flex-shrink-0 group"
          >
            <LinkedInLogo className="w-4 h-4 text-[#0A66C2]/50 group-hover:text-[#0A66C2] transition-colors" />
            <span className="hidden sm:inline">{viewOnLinkedInLabel}</span>
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
