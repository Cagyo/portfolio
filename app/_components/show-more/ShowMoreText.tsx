'use client'

import { useId, useState, useRef, useLayoutEffect } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/app/_lib/cn'
import { ChevronDownIcon } from '@/assets/icons/ChevronDownIcon'

type ShowMoreTextProps = {
  text: string
  textClassName?: string
  collapsedLines?: number
}

export function ShowMoreText({ text, textClassName, collapsedLines = 2 }: ShowMoreTextProps) {
  const t = useTranslations('common')
  const textId = useId()
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
        id={textId}
        ref={ref}
        className={cn('overflow-hidden', textClassName)}
        style={{ maxHeight: isExpanded ? (fullHeight ?? undefined) : collapsedHeight }}
      >
        {text}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-controls={textId}
          aria-expanded={isExpanded}
          className="show-more-toggle inline-flex items-center gap-[0.2rem] text-[0.75rem] mt-1 cursor-pointer transition-colors duration-150 hover:text-amber-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-[3px] focus-visible:rounded-md motion-reduce:transition-none"
        >
          <span>{isExpanded ? t('showLess') : t('showMore')}</span>
          <ChevronDownIcon className={cn(
            'w-3 h-3 transition-transform duration-[350ms] ease-[ease] motion-reduce:transition-none',
            isExpanded && 'rotate-180'
          )} />
        </button>
      )}
    </div>
  )
}
