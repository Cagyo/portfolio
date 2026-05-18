"use client";

import { ExpandSection } from "@/app/_components/expand-section/ExpandSection";
import type { FaqItem as FaqItemData } from "@/app/_data/faq/types";
import styles from "./FaqItem.module.css";

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
  const label = <span className={styles.questionText}>{item.question}</span>;
  const itemClassNames = itemClassName ? `scroll-mt-24 ${itemClassName}` : "scroll-mt-24";
  const buttonClassNames = buttonClassName ? `${styles.faqButton} ${buttonClassName}` : styles.faqButton;
  const panelContentClassNames = panelContentClassName
    ? `${styles.panelContent} ${panelContentClassName}`
    : styles.panelContent;

  return (
    <li id={item.slug} className={itemClassNames}>
      {eyebrow && <div className={eyebrowClassName ?? styles.eyebrow}>{eyebrow}</div>}
      <ExpandSection
        isExpanded={isOpen}
        onToggle={onToggle}
        expandLabel={label}
        collapseLabel={label}
        buttonClassName={buttonClassNames}
        panelId={`faq-panel-${item.slug}`}
      >
        <div className={panelContentClassNames}>
          <p className={styles.answer}>{item.answer}</p>
          <p className={styles.body}>{item.body}</p>
        </div>
      </ExpandSection>
    </li>
  );
}
