"use client";

import { ExpandSection } from "@/app/_components/expand-section/ExpandSection";
import type { FaqItem as FaqItemData } from "@/app/_data/faq/types";
import { cn } from "@/app/_lib/cn";

type FaqItemProps = {
  item: FaqItemData;
  isOpen: boolean;
  onToggle: () => void;
  eyebrow?: string;
  eyebrowClassName?: string;
  itemClassName?: string;
  buttonClassName?: string;
  panelContentClassName?: string;
};

const defaultEyebrowClassName = "mb-3 inline-flex w-fit items-center rounded-full border border-[color-mix(in_srgb,var(--amber)_22%,transparent)] bg-amber/8 px-[0.65rem] py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-amber-foreground [html[data-theme=light]_&]:text-[var(--tag-color)]";
const faqButtonClassName = "flex min-h-14 w-full cursor-pointer flex-row-reverse items-start justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 text-left text-foreground transition-[transform,box-shadow,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--amber)_28%,var(--border))] hover:bg-card-hover hover:shadow-[0_14px_34px_color-mix(in_srgb,var(--amber)_14%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber motion-reduce:transition-[border-color,background-color] motion-reduce:hover:transform-none [&>span]:min-w-0 [&>span]:flex-1 [&>svg]:mt-1 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-amber [html[data-theme=light]_&]:hover:border-border-amber [html[data-theme=light]_&]:hover:shadow-[0_14px_34px_color-mix(in_srgb,var(--amber)_10%,transparent)] [html[data-theme=light]_&]:[&>svg]:text-[var(--tag-color)]";
const questionTextClassName = "block text-left font-heading text-base font-bold leading-[1.35] text-foreground";
const panelContentBaseClassName = "grid gap-[0.65rem] px-5 pb-[1.3rem] pt-[0.95rem]";
const answerClassName = "font-bold leading-[1.65] text-foreground";
const bodyClassName = "whitespace-pre-line leading-[1.75] text-foreground-soft";

export function FaqItem({
  item,
  isOpen,
  onToggle,
  eyebrow,
  eyebrowClassName,
  itemClassName,
  buttonClassName,
  panelContentClassName,
}: FaqItemProps) {
  const label = <span className={questionTextClassName}>{item.question}</span>;
  const itemClassNames = cn("scroll-mt-24", itemClassName);
  const buttonClassNames = cn(faqButtonClassName, buttonClassName);
  const panelContentClassNames = cn(panelContentBaseClassName, panelContentClassName);

  return (
    <li id={item.slug} className={itemClassNames}>
      {eyebrow && <div className={eyebrowClassName ?? defaultEyebrowClassName}>{eyebrow}</div>}
      <ExpandSection
        isExpanded={isOpen}
        onToggle={onToggle}
        expandLabel={label}
        collapseLabel={label}
        buttonClassName={buttonClassNames}
        panelId={`faq-panel-${item.slug}`}
      >
        <div className={panelContentClassNames}>
          <p className={answerClassName}>{item.answer}</p>
          <p className={bodyClassName}>{item.body}</p>
        </div>
      </ExpandSection>
    </li>
  );
}
