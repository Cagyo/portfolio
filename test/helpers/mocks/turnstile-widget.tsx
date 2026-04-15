'use client'

import { forwardRef, useImperativeHandle } from 'react'

type TurnstileProps = {
  onVerify?: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export type TurnstileInstance = {
  reset: () => void
}

const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileProps>(
  function TurnstileWidget({ onVerify }, ref) {
    useImperativeHandle(ref, () => ({
      reset: () => {
        onVerify?.('')
      },
    }))

    return (
      <button
        type="button"
        data-testid="turnstile-mock"
        onClick={() => onVerify?.('test-token')}
      >
        Verify (mock)
      </button>
    )
  },
)

export default TurnstileWidget
