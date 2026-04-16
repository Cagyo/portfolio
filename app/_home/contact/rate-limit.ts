// In-memory sliding-window rate limiter.
// Per-instance state — resets on redeploy, fragments across serverless instances.
// Acceptable for a portfolio. Upgrade path: @upstash/ratelimit (same call signature).

import 'server-only'

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_HITS = 5

const store = new Map<string, number[]>()

export function checkRateLimit(ip: string): { ok: boolean } {
  const now = Date.now()
  const hits = (store.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  )

  if (hits.length >= MAX_HITS) {
    return { ok: false }
  }

  hits.push(now)
  store.set(ip, hits)

  if (store.size > 5000) {
    for (const [key, timestamps] of store) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) {
        store.delete(key)
      }
    }
  }

  return { ok: true }
}

/** Exposed for tests only — do not call in production code. */
export const _getStoreSize = (): number => store.size
