"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { readConsent, writeConsent, type ConsentStatus, type StoredConsentStatus } from "./consent-storage"

type ConsentContextValue = {
  status: ConsentStatus
  hydrated: boolean
  forceOpen: boolean
  focusRequestId: number
  setConsent: (value: StoredConsentStatus) => void
  reopen: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unset")
  const [hydrated, setHydrated] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)
  const [focusRequestId, setFocusRequestId] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus(readConsent())
      setHydrated(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const setConsent = useCallback((value: StoredConsentStatus) => {
    writeConsent(value)
    setStatus(value)
    setForceOpen(false)
  }, [])

  const reopen = useCallback(() => {
    setForceOpen(true)
    setFocusRequestId((prev) => prev + 1)
  }, [])

  const value = useMemo(
    () => ({ status, hydrated, forceOpen, focusRequestId, setConsent, reopen }),
    [status, hydrated, forceOpen, focusRequestId, setConsent, reopen],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const context = useContext(ConsentContext)

  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider")
  }

  return context
}