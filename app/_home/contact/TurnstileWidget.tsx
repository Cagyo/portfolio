'use client'

import { forwardRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

type TurnstileWidgetProps = {
  siteKey: string
  size: 'invisible' | 'compact' | 'normal'
  onVerify: (token: string) => void
}

export const TurnstileWidget = forwardRef<
  TurnstileInstance,
  TurnstileWidgetProps
>(function TurnstileWidget({ siteKey, size, onVerify }, ref) {
  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      options={{ size, theme: 'auto' }}
      onSuccess={onVerify}
    />
  )
})
