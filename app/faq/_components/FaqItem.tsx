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
};

export function FaqItem({ item, isOpen, onToggle, eyebrow, eyebrowClassName }: FaqItemProps) {
  const label = <span className={styles.questionText}>{item.question}</span>;

  return (
    <li id={item.slug} className="scroll-mt-24">
      {eyebrow && <div className={eyebrowClassName ?? styles.eyebrow}>{eyebrow}</div>}
      <ExpandSection
        isExpanded={isOpen}
        onToggle={onToggle}
        expandLabel={label}
        collapseLabel={label}
        buttonClassName={styles.faqButton}
        panelId={`faq-panel-${item.slug}`}
      >
        <div className={styles.panelContent}>
          <p className={styles.answer}>{item.answer}</p>
          <p className={styles.body}>{item.body}</p>
        </div>
      </ExpandSection>
    </li>
  );
}
