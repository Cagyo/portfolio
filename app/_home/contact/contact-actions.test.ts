import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))
vi.mock('./turnstile-verify', () => ({
  verifyTurnstile: vi.fn(),
}))
vi.mock('./rate-limit', () => ({
  checkRateLimit: vi.fn(),
}))
vi.mock('./email-client', () => ({
  sendContactEmail: vi.fn(),
}))
// ContactEmail is a React element — stub it to avoid JSX / React Email deps
vi.mock('./ContactEmail', () => ({
  ContactEmail: vi.fn(() => null),
}))

import { headers as nextHeaders } from 'next/headers'
import { verifyTurnstile } from './turnstile-verify'
import { checkRateLimit } from './rate-limit'
import { sendContactEmail } from './email-client'
import { sendContactMessage } from './contact-actions'

const mockHeaders = nextHeaders as ReturnType<typeof vi.fn>
const mockVerifyTurnstile = verifyTurnstile as ReturnType<typeof vi.fn>
const mockCheckRateLimit = checkRateLimit as ReturnType<typeof vi.fn>
const mockSendContactEmail = sendContactEmail as ReturnType<typeof vi.fn>

function makeHeaders(map: Record<string, string> = {}): Headers {
  return new Headers(map)
}

function makeTextFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData()
  fd.set('mode', 'text')
  fd.set('name', 'Alice Smith')
  fd.set('email', 'alice@example.com')
  fd.set('website', '')
  fd.set('turnstileToken', 'tok')
  fd.set('subject', 'Hello there')
  fd.set('budget', '5k')
  fd.set('message', 'This is a valid message with enough chars.')
  Object.entries(overrides).forEach(([key, value]) => fd.set(key, value))
  return fd
}

function makeVoiceFormData(files: File[] = [makeWebmFile(1)]): FormData {
  const fd = new FormData()
  fd.set('mode', 'voice')
  fd.set('name', 'Alice Smith')
  fd.set('email', 'alice@example.com')
  fd.set('website', '')
  fd.set('turnstileToken', 'tok')
  files.forEach((file) => fd.append('voiceRecordings', file))
  return fd
}

function makeWebmFile(sizeMb: number, name?: string): File {
  const bytes = new Uint8Array(sizeMb * 1024 * 1024)
  return new File([bytes], name ?? 'recording-1.webm', { type: 'audio/webm' })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.stubEnv('CONTACT_INBOX_EMAIL', 'inbox@test.com')
  vi.stubEnv('RESEND_FROM_EMAIL', 'from@test.com')
  mockHeaders.mockResolvedValue(makeHeaders({ 'x-forwarded-for': '1.1.1.1' }))
  mockVerifyTurnstile.mockResolvedValue({ ok: true })
  mockCheckRateLimit.mockReturnValue({ ok: true })
  mockSendContactEmail.mockResolvedValue(undefined)
})

describe('sendContactMessage', () => {
  // 1. Honeypot filled → silent success, no side effects
  it('case 1: honeypot filled → silent success without calling email services', async () => {
    const fd = makeTextFormData({ website: 'spam-bot' })
    const result = await sendContactMessage(null, fd)
    expect(result).toEqual({ success: true })
    expect(mockVerifyTurnstile).not.toHaveBeenCalled()
    expect(mockCheckRateLimit).not.toHaveBeenCalled()
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  // 2. Turnstile fails → error: 'turnstile', email never called
  it('case 2: turnstile fails → { success: false, error: turnstile }', async () => {
    mockVerifyTurnstile.mockResolvedValue({ ok: false })
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: false, error: 'turnstile' })
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  // 3. Turnstile ok + rate limit exceeded → error: 'rateLimited', email never called
  it('case 3: rate limit exceeded → { success: false, error: rateLimited }', async () => {
    mockCheckRateLimit.mockReturnValue({ ok: false })
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: false, error: 'rateLimited' })
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  // 4. Text happy path
  it('case 4: text happy path → sendContactEmail called with correct args', async () => {
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: true })
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    const callArgs = mockSendContactEmail.mock.calls[0][0]
    expect(callArgs.to).toBe('inbox@test.com')
    expect(callArgs.from).toBe('from@test.com')
    expect(callArgs.replyTo).toBe('alice@example.com')
    expect(callArgs.subject).toBe('[Portfolio] Hello there')
    expect(callArgs.attachments).toBeUndefined()
  })

  // 5. Voice happy path → attachments built correctly
  it('case 5: voice happy path → sendContactEmail called with attachments', async () => {
    const file1 = makeWebmFile(1, 'recording-1.webm')
    const file2 = makeWebmFile(1, 'recording-2.webm')
    const result = await sendContactMessage(null, makeVoiceFormData([file1, file2]))
    expect(result).toEqual({ success: true })
    const callArgs = mockSendContactEmail.mock.calls[0][0]
    expect(callArgs.subject).toBe('[Portfolio] Voice message from Alice Smith')
    expect(callArgs.attachments).toHaveLength(2)
    expect(callArgs.attachments[0].filename).toBe('recording-1.webm')
    expect(callArgs.attachments[1].filename).toBe('recording-2.webm')
    expect(Buffer.isBuffer(callArgs.attachments[0].content)).toBe(true)
    expect(Buffer.isBuffer(callArgs.attachments[1].content)).toBe(true)
  })

  // 6. Text mode with voice file in FormData → server schema rejects
  it('case 6: text mode with voice file → voice-related schema error', async () => {
    const fd = makeTextFormData()
    fd.append('voiceRecordings', makeWebmFile(1))
    const result = await sendContactMessage(null, fd)
    expect(result.success).toBe(false)
    if (!result.success) {
      // mapZodError maps voiceRecordings issues depending on sub-message
      expect(['voiceTooLarge', 'voiceMissing', 'voiceTooMany']).toContain(result.error)
    }
  })

  // 7. Voice mode with zero files → voiceMissing
  it('case 7: voice mode zero files → { success: false, error: voiceMissing }', async () => {
    const result = await sendContactMessage(null, makeVoiceFormData([]))
    expect(result).toEqual({ success: false, error: 'voiceMissing' })
  })

  // 8. Voice mode with 6 files → voiceTooMany
  it('case 8: voice mode 6 files → { success: false, error: voiceTooMany }', async () => {
    const files = Array.from({ length: 6 }, (_, fileIndex) =>
      makeWebmFile(1, `recording-${fileIndex + 1}.webm`),
    )
    const result = await sendContactMessage(null, makeVoiceFormData(files))
    expect(result).toEqual({ success: false, error: 'voiceTooMany' })
  })

  // 9. Voice mode total > 20 MB → voiceTooLarge
  it('case 9: voice mode total > 20 MB → { success: false, error: voiceTooLarge }', async () => {
    // 5 × 5MB = 25 MB, max per-file is 5MB so each just fits individually, but total exceeds limit
    const files = Array.from({ length: 5 }, (_, fileIndex) =>
      makeWebmFile(4.1, `recording-${fileIndex + 1}.webm`),
    )
    const result = await sendContactMessage(null, makeVoiceFormData(files))
    expect(result).toEqual({ success: false, error: 'voiceTooLarge' })
  })

  // 10. Short name → nameInvalid
  it('case 10: short name → { success: false, error: nameInvalid }', async () => {
    const result = await sendContactMessage(null, makeTextFormData({ name: 'A' }))
    expect(result).toEqual({ success: false, error: 'nameInvalid' })
  })

  // 11. Invalid email → emailInvalid
  it('case 11: invalid email → { success: false, error: emailInvalid }', async () => {
    const result = await sendContactMessage(null, makeTextFormData({ email: 'not-an-email' }))
    expect(result).toEqual({ success: false, error: 'emailInvalid' })
  })

  // 12. Unknown budget enum → budgetInvalid
  it('case 12: unknown budget enum → { success: false, error: budgetInvalid }', async () => {
    const result = await sendContactMessage(null, makeTextFormData({ budget: 'GALAXY_BRAIN' }))
    expect(result).toEqual({ success: false, error: 'budgetInvalid' })
  })

  // 13. Missing CONTACT_INBOX_EMAIL → sendFailed
  it('case 13: missing CONTACT_INBOX_EMAIL → { success: false, error: sendFailed }', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('RESEND_FROM_EMAIL', 'from@test.com')
    // CONTACT_INBOX_EMAIL not set
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: false, error: 'sendFailed' })
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  // 14. Missing RESEND_FROM_EMAIL → sendFailed
  it('case 14: missing RESEND_FROM_EMAIL → { success: false, error: sendFailed }', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('CONTACT_INBOX_EMAIL', 'inbox@test.com')
    // RESEND_FROM_EMAIL not set
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: false, error: 'sendFailed' })
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  // 15. sendContactEmail throws → sendFailed
  it('case 15: sendContactEmail throws → { success: false, error: sendFailed }', async () => {
    mockSendContactEmail.mockRejectedValue(new Error('Network Error'))
    const result = await sendContactMessage(null, makeTextFormData())
    expect(result).toEqual({ success: false, error: 'sendFailed' })
  })

  // 16. x-forwarded-for: '1.1.1.1, 2.2.2.2' → first token '1.1.1.1' used
  it('case 16: x-forwarded-for multi-value → first IP used for turnstile + rate-limit', async () => {
    mockHeaders.mockResolvedValue(makeHeaders({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))
    await sendContactMessage(null, makeTextFormData())
    expect(mockVerifyTurnstile).toHaveBeenCalledWith('tok', '1.1.1.1')
    expect(mockCheckRateLimit).toHaveBeenCalledWith('1.1.1.1')
  })

  // 17. Only x-real-ip → that value used
  it('case 17: only x-real-ip header → that value used', async () => {
    mockHeaders.mockResolvedValue(makeHeaders({ 'x-real-ip': '9.9.9.9' }))
    await sendContactMessage(null, makeTextFormData())
    expect(mockVerifyTurnstile).toHaveBeenCalledWith('tok', '9.9.9.9')
    expect(mockCheckRateLimit).toHaveBeenCalledWith('9.9.9.9')
  })

  // 18. Neither header → 'unknown' used
  it('case 18: no IP headers → "unknown" used', async () => {
    mockHeaders.mockResolvedValue(makeHeaders({}))
    await sendContactMessage(null, makeTextFormData())
    expect(mockVerifyTurnstile).toHaveBeenCalledWith('tok', 'unknown')
    expect(mockCheckRateLimit).toHaveBeenCalledWith('unknown')
  })

  // 19. mapZodError fallback: unknown path → 'unknown'
  it('case 19: Zod error on unknown path → { success: false, error: unknown }', async () => {
    // Pass a field that the server schema will reject in an unexpected way.
    // The simplest trigger: omit mode entirely so discriminatedUnion emits an error on 'mode'.
    // mapZodError: field === 'website' → 'unknown'; unknown path → 'unknown'
    // For this, we send a mode that matches no branch at the discriminator level
    const fd = new FormData()
    fd.set('mode', 'UNKNOWN_MODE')
    fd.set('name', 'Alice Smith')
    fd.set('email', 'alice@example.com')
    fd.set('website', '')
    fd.set('turnstileToken', 'tok')
    const result = await sendContactMessage(null, fd)
    expect(result).toEqual({ success: false, error: 'unknown' })
  })
})
