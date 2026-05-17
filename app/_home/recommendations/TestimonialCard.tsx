"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { QuoteMarkIcon } from "@/assets/icons/QuoteMarkIcon";
import { LinkedInLogo } from "@/assets/logos/LinkedInLogo";
import styles from "./TestimonialCard.module.css";

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
  const cardClassName = `${styles.card} ${
    variant === "feature" ? styles.cardFeature : styles.cardCarousel
  }`;

  return (
    <div className={cardClassName}>
      <div className={styles.metaPanel}>
        <div className={styles.authorBlock}>
          {author.photoUrl ? (
            <div className={styles.avatar}>
              <Image
                src={author.photoUrl}
                alt={author.name}
                width={40}
                height={40}
                className={styles.avatarImage}
              />
            </div>
          ) : (
            <div className={`${styles.avatarFallback} ${author.gradientClass}`}>
              <span className={author.initialsColor ?? "text-black"}>
                {author.initials}
              </span>
            </div>
          )}
          <div className={styles.authorText}>
            <p className={styles.authorName}>{author.name}</p>
            <p className={styles.authorRole}>{author.role}</p>
          </div>
        </div>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            aria-label={viewOnLinkedInLabel}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedinLink}
          >
            <LinkedInLogo className={styles.linkedinIcon} />
            <span className={styles.linkedinLabel}>{viewOnLinkedInLabel}</span>
            <ExternalLinkIcon className={styles.externalIcon} />
          </a>
        )}
      </div>
      <div className={styles.quotePanel}>
        <QuoteMarkIcon className={styles.quoteIcon} />
        <div className={styles.quoteBody}>
          {paragraphs.map((paragraph, index) => {
            const isFirst = index === 0;
            const isLast = index === paragraphs.length - 1;
            const stableKey = paragraph.slice(0, 40);
            const showReadMore = !expanded && hasMore && isLast;

            return (
              <p key={stableKey} className={styles.quoteParagraph}>
                {isFirst && "\u201C"}
                {paragraph}
                {showReadMore && (
                  <>
                    {" "}
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setExpanded(true)}
                      className={styles.readMoreButton}
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
              className={styles.readLessButton}
            >
              {readLessLabel ?? "Read less"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
