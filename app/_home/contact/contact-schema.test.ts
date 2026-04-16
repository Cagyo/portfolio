import { describe, it, expect } from 'vitest'
import { contactSchema } from './contact-schema'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024

function makeFileMeta(overrides?: Partial<{ name: string; size: number; type: string }>) {
  return {
    name: 'recording.webm',
    size: 1024,
    type: 'audio/webm',
    ...overrides,
  }
}

const validTextPayload = {
  mode: 'text' as const,
  name: 'Alice',
  email: 'alice@example.com',
  website: '',
  turnstileToken: 'tok',
  subject: 'Hello there',
  budget: '5k' as const,
  message: 'This is a valid message with enough chars.',
  voiceRecordings: [],
}

const validVoicePayload = {
  mode: 'voice' as const,
  name: 'Alice',
  email: 'alice@example.com',
  website: '',
  turnstileToken: 'tok',
  voiceRecordings: [makeFileMeta()],
}

describe('contactSchema (server)', () => {
  // 1. mode missing/unknown → discriminator rejects
  it('case 1: missing mode → discriminator rejects', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      website: '',
      turnstileToken: 'tok',
    })
    expect(result.success).toBe(false)
  })

  it('case 1b: unknown mode literal → discriminator rejects', () => {
    const result = contactSchema.safeParse({
      mode: 'fax',
      name: 'Alice',
      email: 'alice@example.com',
      website: '',
      turnstileToken: 'tok',
    })
    expect(result.success).toBe(false)
  })

  // 2. Text mode forbids voice recordings
  it('case 2: text mode with voiceRecordings → fails on max(0)', () => {
    const result = contactSchema.safeParse({
      ...validTextPayload,
      voiceRecordings: [makeFileMeta()],
    })
    expect(result.success).toBe(false)
  })

  // 3. Text mode valid payload → success
  it('case 3: text mode valid payload → success', () => {
    const result = contactSchema.safeParse(validTextPayload)
    expect(result.success).toBe(true)
  })

  // 4. Voice mode MIME image/png → invalidAudioType
  it('case 4: voice mode MIME image/png → invalidAudioType', () => {
    const result = contactSchema.safeParse({
      ...validVoicePayload,
      voiceRecordings: [makeFileMeta({ type: 'image/png' })],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((issue) => issue.message === 'invalidAudioType')
      expect(issue).toBeDefined()
    }
  })

  // 5. Voice mode MIME audio/webm → passes
  it('case 5: voice mode MIME audio/webm → passes', () => {
    const result = contactSchema.safeParse({
      ...validVoicePayload,
      voiceRecordings: [makeFileMeta({ type: 'audio/webm' })],
    })
    expect(result.success).toBe(true)
  })

  // 6. Voice mode size: 0 → fails (positive())
  it('case 6: voice mode size 0 → fails', () => {
    const result = contactSchema.safeParse({
      ...validVoicePayload,
      voiceRecordings: [makeFileMeta({ size: 0 })],
    })
    expect(result.success).toBe(false)
  })

  // 7. Voice mode single file > 5 MB → fails
  it('case 7: voice mode single file > 5 MB → fails', () => {
    const result = contactSchema.safeParse({
      ...validVoicePayload,
      voiceRecordings: [makeFileMeta({ size: MAX_FILE_BYTES + 1 })],
    })
    expect(result.success).toBe(false)
  })

  // 8. Voice mode total > 20 MB via 5 × 4.5 MB → voiceTooLarge
  it('case 8: voice mode 5 × 4.5 MB total > 20 MB → voiceTooLarge', () => {
    const fileSize = Math.floor(MAX_TOTAL_BYTES / 5) + 1 // 4MB + 1 byte * 5 > 20MB
    const files = Array.from({ length: 5 }, () => makeFileMeta({ size: fileSize }))
    const result = contactSchema.safeParse({
      ...validVoicePayload,
      voiceRecordings: files,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((issue) => issue.message === 'voiceTooLarge')
      expect(issue).toBeDefined()
    }
  })

  // 9. Voice mode with subject/budget/message absent → passes
  it('case 9: voice mode without optional fields → still passes', () => {
    const { subject: _s, budget: _b, message: _m, ..._baseVoice } = {
      ...validVoicePayload,
      subject: undefined as unknown,
      budget: undefined as unknown,
      message: undefined as unknown,
    }
    void _s; void _b; void _m; void _baseVoice
    const result = contactSchema.safeParse(validVoicePayload)
    expect(result.success).toBe(true)
  })

  // 10. budget: '' valid in both modes
  it('case 10: budget empty string is valid in text mode', () => {
    const result = contactSchema.safeParse({ ...validTextPayload, budget: '' })
    expect(result.success).toBe(true)
  })

  it('case 10b: budget empty string is valid in voice mode', () => {
    const result = contactSchema.safeParse({ ...validVoicePayload, budget: '' })
    expect(result.success).toBe(true)
  })

  // 11. website non-empty → fails
  it('case 11: website non-empty in text mode → fails', () => {
    const result = contactSchema.safeParse({ ...validTextPayload, website: 'spam' })
    expect(result.success).toBe(false)
  })

  it('case 11b: website non-empty in voice mode → fails', () => {
    const result = contactSchema.safeParse({ ...validVoicePayload, website: 'spam' })
    expect(result.success).toBe(false)
  })
})
