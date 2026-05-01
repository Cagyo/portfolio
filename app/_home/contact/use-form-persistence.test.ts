import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { useFormPersistence } from './use-form-persistence'

type Draft = {
  name: string
  email: string
  message: string
}

const STORAGE_KEY = 'test-draft'

function setStored(payload: unknown) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function getStored(): unknown {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  return raw === null ? null : JSON.parse(raw)
}

function renderPersistedForm({
  defaultValues,
  ttlMs,
  debounceMs = 200,
  shouldClear = false,
}: {
  defaultValues?: Partial<Draft>
  ttlMs?: number
  debounceMs?: number
  shouldClear?: boolean
} = {}) {
  return renderHook(
    ({ shouldClear: clearFlag }: { shouldClear: boolean }) => {
      const form = useForm<Draft>({
        defaultValues: { name: '', email: '', message: '', ...defaultValues },
      })
      useFormPersistence({
        storageKey: STORAGE_KEY,
        form,
        fields: ['name', 'email', 'message'],
        ttlMs,
        debounceMs,
        shouldClear: clearFlag,
      })
      return form
    },
    { initialProps: { shouldClear } },
  )
}

describe('useFormPersistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('restores name from localStorage on mount', () => {
    setStored({ v: 1, t: Date.now(), d: { name: 'Alice' } })
    const { result } = renderPersistedForm()
    expect(result.current.getValues('name')).toBe('Alice')
  })

  it('debounces writes — no write within debounce window, one write after', async () => {
    const { result } = renderPersistedForm({ debounceMs: 300 })

    await act(async () => {
      result.current.setValue('name', 'A')
    })

    // Not yet flushed
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()

    // After full debounce window
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    const stored = getStored() as { d: { name: string } } | null
    expect(stored?.d.name).toBe('A')
  })

  it('discards entries older than ttlMs and removes the storage key', () => {
    const oldT = Date.now() - 10_000
    setStored({ v: 1, t: oldT, d: { name: 'Stale' } })
    const { result } = renderPersistedForm({ ttlMs: 1_000 })
    expect(result.current.getValues('name')).toBe('')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('removes the storage key when shouldClear flips true', async () => {
    setStored({ v: 1, t: Date.now(), d: { name: 'Alice' } })
    const { rerender } = renderPersistedForm({ shouldClear: false })
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    await act(async () => {
      rerender({ shouldClear: true })
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('tolerates malformed JSON without throwing and removes the bad key', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json')
    expect(() => renderPersistedForm()).not.toThrow()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('skips persisting when all watched values are empty', async () => {
    const { result } = renderPersistedForm({ debounceMs: 100 })

    await act(async () => {
      result.current.setValue('name', '')
      vi.advanceTimersByTime(200)
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
