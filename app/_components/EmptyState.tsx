"use client";

import { EmptyFaceIcon } from "@/assets/icons/EmptyFaceIcon";
import { Button } from "@/app/_components/button/Button";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  message: string
  clearLabel: string
  hint?: string
  onClear: () => void
  ctaHref?: string
  ctaLabel?: string
  primaryClear?: boolean
}

export function EmptyState({ message, clearLabel, hint, onClear, ctaHref, ctaLabel, primaryClear = false }: EmptyStateProps) {
  const clearButton = (
    <button
      type="button"
      onClick={onClear}
      className={primaryClear ? styles.clearButtonPrimary : styles.clearButton}
    >
      {clearLabel}
    </button>
  );

  return (
    <div className={styles.emptyState}>
      <EmptyFaceIcon className={styles.icon} />
      <p className={styles.message}>{message}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.actions}>
        {primaryClear && clearButton}
        {ctaHref && ctaLabel && (
          <Button href={ctaHref} className={styles.cta}>
            {ctaLabel}
          </Button>
        )}
        {!primaryClear && clearButton}
      </div>
    </div>
  );
}
