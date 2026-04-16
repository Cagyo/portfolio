import { describe, it, expect, vi, beforeEach } from 'vitest'

// turnstile-verify imports 'server-only'. We stub that module so tests can import it.
vi.mock('server-only', () => ({}))

// Import after mock
const { verifyTurnstile } = await import('./turnstile-verify')

describe('verifyTurnstile', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  // 1. Missing secret env → { ok: false }, fetch never called
  it('case 1: missing TURNSTILE_SECRET_KEY → ok: false, no fetch', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await verifyTurnstile('some-token', '1.2.3.4')
    expect(result).toEqual({ ok: false })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  // 2. Null token → { ok: false }, fetch never called
  it('case 2: null token → ok: false, no fetch', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await verifyTurnstile(null, '1.2.3.4')
    expect(result).toEqual({ ok: false })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  // 3. Fetch returns response.ok = false → { ok: false }
  it('case 3: fetch response.ok = false → ok: false', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const result = await verifyTurnstile('some-token', '1.2.3.4')
    expect(result).toEqual({ ok: false })
  })

  // 4. Fetch returns JSON { success: true } → { ok: true }
  it('case 4: fetch returns { success: true } → ok: true', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }))

    const result = await verifyTurnstile('some-token', '1.2.3.4')
    expect(result).toEqual({ ok: true })
  })

  // 5. Fetch returns JSON { success: false } → { ok: false }
  it('case 5: fetch returns { success: false } → ok: false', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false }),
    }))

    const result = await verifyTurnstile('some-token', '1.2.3.4')
    expect(result).toEqual({ ok: false })
  })

  // 6. Request body contains secret, response, remoteip
  it('case 6: fetch called with correct URLSearchParams body', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    vi.stubGlobal('fetch', fetchSpy)

    await verifyTurnstile('user-token', '5.6.7.8')

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [_url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    const body = init.body as URLSearchParams
    expect(body.get('secret')).toBe('test-secret')
    expect(body.get('response')).toBe('user-token')
    expect(body.get('remoteip')).toBe('5.6.7.8')
  })
})
