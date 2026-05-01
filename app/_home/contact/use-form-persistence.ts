'use client'

import { useEffect, useRef } from 'react'
import type { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form'

type PersistOptions<TValues extends FieldValues> = {
  /** localStorage key */
  storageKey: string
  /** form instance */
  form: UseFormReturn<TValues>
  /** Subset of fields to persist (skip secrets, blobs, honeypot) */
  fields: ReadonlyArray<Path<TValues>>
  /** Time-to-live in milliseconds. Older drafts are discarded. */
  ttlMs?: number
  /** Debounce write delay in milliseconds */
  debounceMs?: number
  /** When true (e.g. on submission success), drop the persisted draft */
  shouldClear?: boolean
}

type StoredDraft = {
  v: 1
  t: number
  d: Record<string, unknown>
}

const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000
const DEFAULT_DEBOUNCE = 500

/**
 * Persist a subset of react-hook-form values to localStorage so users don't
 * lose typed content on refresh/tab-close. Restores once on mount; clears on
 * success.
 */
export function useFormPersistence<TValues extends FieldValues>({
  storageKey,
  form,
  fields,
  ttlMs = DEFAULT_TTL,
  debounceMs = DEFAULT_DEBOUNCE,
  shouldClear = false,
}: PersistOptions<TValues>): void {
  const restoredRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore once on mount
  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true

    if (typeof window === 'undefined') return

    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredDraft
      if (parsed?.v !== 1 || typeof parsed.t !== 'number') return
      if (Date.now() - parsed.t > ttlMs) {
        window.localStorage.removeItem(storageKey)
        return
      }
      for (const field of fields) {
        const value = parsed.d?.[field as string]
        if (value === undefined) continue
        form.setValue(field, value as PathValue<TValues, typeof field>, {
          shouldDirty: false,
          shouldValidate: false,
        })
      }
    } catch {
      // Corrupted draft — discard silently
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced write on changes
  const watched = form.watch(fields)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const draft: Record<string, unknown> = {}
        let hasContent = false
        fields.forEach((field, index) => {
          const value = watched[index]
          if (value !== '' && value !== undefined && value !== null) {
            draft[field as string] = value
            hasContent = true
          }
        })
        if (!hasContent) {
          window.localStorage.removeItem(storageKey)
          return
        }
        const payload: StoredDraft = { v: 1, t: Date.now(), d: draft }
        window.localStorage.setItem(storageKey, JSON.stringify(payload))
      } catch {
        // ignore quota / private-mode failures
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // watched is an array reference that changes on each form change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched, debounceMs, storageKey])

  // Clear on success
  useEffect(() => {
    if (!shouldClear || typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [shouldClear, storageKey])
}
