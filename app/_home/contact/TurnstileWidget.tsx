'use client'

import { forwardRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

type TurnstileWidgetProps = {
  siteKey: string
  onVerify: (token: string) => void
}

export const TurnstileWidget = forwardRef<
  TurnstileInstance,
  TurnstileWidgetProps
>(function TurnstileWidget({ siteKey, onVerify }, ref) {
  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      options={{ size: 'invisible', theme: 'dark' }}
      onSuccess={onVerify}
    />
  )
})
