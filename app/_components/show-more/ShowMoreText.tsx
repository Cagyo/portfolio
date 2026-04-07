'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import { ChevronDownIcon } from '../../../assets/icons/ChevronDownIcon'
import styles from './ShowMoreText.module.css'

type ShowMoreTextProps = {
  text: string
  textClassName?: string
  collapsedLines?: number
}

export function ShowMoreText({ text, textClassName, collapsedLines = 2 }: ShowMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [fullHeight, setFullHeight] = useState<number | null>(null)
  const [collapsedHeight, setCollapsedHeight] = useState(0)
  const ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const computed = lineHeight * collapsedLines
    setCollapsedHeight(computed)

    const prevMax = el.style.maxHeight
    el.style.maxHeight = 'none'
    const full = el.scrollHeight
    el.style.maxHeight = prevMax
    setFullHeight(full)
  }, [text, collapsedLines])

  const needsToggle = fullHeight !== null && fullHeight > collapsedHeight

  return (
    <div>
      <p
        ref={ref}
        className={`${styles.text} ${textClassName ?? ''}`}
        style={{ maxHeight: isExpanded ? (fullHeight ?? 'none') : collapsedHeight }}
      >
        {text}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={styles.toggle}
        >
          <span>{isExpanded ? 'Show less' : 'Show more'}</span>
          <ChevronDownIcon className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`} />
        </button>
      )}
    </div>
  )
}
