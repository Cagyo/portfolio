import { useState } from 'react'

type UseShowMoreResult = {
  expanded: boolean
  toggle: () => void
  hiddenCount: number
}

export function useShowMore(total: number, initialVisible: number): UseShowMoreResult {
  const [expanded, setExpanded] = useState(false)
  return {
    expanded,
    toggle: () => setExpanded((prev) => !prev),
    hiddenCount: Math.max(0, total - initialVisible),
  }
}
