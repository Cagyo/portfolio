import { describe, it, expect, vi, beforeEach } from 'vitest'


// Rate limiter keeps module-level state. We must reset by re-importing after each module reset.
// vi.resetModules() is called in beforeEach so each test gets a clean store.

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    vi.resetModules()
  })

  async function getCheckRateLimit() {
    const mod = await import('./rate-limit')
    return mod.checkRateLimit
  }

  // 1. First hit from new IP → ok
  it('case 1: first hit from new IP → ok', async () => {
    const checkRateLimit = await getCheckRateLimit()
    expect(checkRateLimit('1.2.3.4')).toEqual({ ok: true })
  })

  // 2. 5 hits within window → all ok
  it('case 2: 5 hits within window → all ok', async () => {
    const checkRateLimit = await getCheckRateLimit()
    for (let hitIndex = 0; hitIndex < 5; hitIndex++) {
      expect(checkRateLimit('1.2.3.4')).toEqual({ ok: true })
    }
  })

  // 3. 6th hit within window → not ok
  it('case 3: 6th hit within window → not ok', async () => {
    const checkRateLimit = await getCheckRateLimit()
    for (let hitIndex = 0; hitIndex < 5; hitIndex++) {
      checkRateLimit('1.2.3.4')
    }
    expect(checkRateLimit('1.2.3.4')).toEqual({ ok: false })
  })

  // 4. After advancing 61 min, next hit → ok (stale entries filtered)
  it('case 4: after 61 min window expires → ok again', async () => {
    const checkRateLimit = await getCheckRateLimit()
    for (let hitIndex = 0; hitIndex < 5; hitIndex++) {
      checkRateLimit('1.2.3.4')
    }
    // 6th hit blocked
    expect(checkRateLimit('1.2.3.4')).toEqual({ ok: false })

    // Advance past the 60-min window
    vi.advanceTimersByTime(61 * 60 * 1000)

    expect(checkRateLimit('1.2.3.4')).toEqual({ ok: true })
  })

  // 5. Two different IPs — budgets independent
  it('case 5: two different IPs have independent budgets', async () => {
    const checkRateLimit = await getCheckRateLimit()
    for (let hitIndex = 0; hitIndex < 5; hitIndex++) {
      expect(checkRateLimit('1.1.1.1')).toEqual({ ok: true })
      expect(checkRateLimit('2.2.2.2')).toEqual({ ok: true })
    }
    expect(checkRateLimit('1.1.1.1')).toEqual({ ok: false })
    expect(checkRateLimit('2.2.2.2')).toEqual({ ok: false })
  })

  // 6. Self-cleaning when store > 5000 entries
  it('case 6: prunes stale IPs when store exceeds 5000 entries', async () => {
    const mod = await import('./rate-limit')
    const { checkRateLimit, _getStoreSize } = mod

    // Fill 5000 unique IPs, each hitting once — all within current window
    for (let ipIndex = 0; ipIndex < 5000; ipIndex++) {
      checkRateLimit(`10.0.${Math.floor(ipIndex / 256)}.${ipIndex % 256}`)
    }

    // Advance past the window so all those entries are stale
    vi.advanceTimersByTime(61 * 60 * 1000)

    // The 5001st unique IP triggers cleanup of all 5000 stale entries
    const cleanupIp = '192.168.1.1'
    checkRateLimit(cleanupIp)

    // Only cleanupIp's fresh bucket remains — proves stale entries were actually deleted
    expect(_getStoreSize()).toBe(1)
  })
})
