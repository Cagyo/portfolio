'use client'

import { ChevronDownIcon } from '@/assets/icons/ChevronDownIcon'
import styles from './ExpandSection.module.css'

type ExpandSectionProps = {
  isExpanded: boolean
  onToggle: () => void
  expandLabel: React.ReactNode
  collapseLabel: React.ReactNode
  children: React.ReactNode
  buttonClassName?: string
}

export function ExpandSection({
  isExpanded,
  onToggle,
  expandLabel,
  collapseLabel,
  children,
  buttonClassName,
}: ExpandSectionProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={buttonClassName ?? styles.toggle}
      >
        <ChevronDownIcon className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`} />
        <span>{isExpanded ? collapseLabel : expandLabel}</span>
      </button>
      <div
        className={styles.panel}
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className={styles.panelInner}>
          {children}
        </div>
      </div>
    </>
  )
}
