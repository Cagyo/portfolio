import { describe, it, expect } from 'vitest'
import { contactFormSchema } from './contact-form-schema'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024

function makeBlob(size: number): Blob {
  const blob = Object.create(Blob.prototype) as Blob
  Object.defineProperty(blob, 'size', { value: size, configurable: true, enumerable: true })
  return blob
}

const validText = {
  name: 'Alice',
  email: 'alice@example.com',
  mode: 'text' as const,
  message: 'This is a valid message with enough chars.',
  voiceRecordings: [],
  turnstileToken: 'tok',
  interest: '' as const,
  website: '',
}

const validVoice = {
  name: 'Alice',
  email: 'alice@example.com',
  mode: 'voice' as const,
  message: '',
  voiceRecordings: [makeBlob(1024 * 1024)],
  turnstileToken: 'tok',
  interest: '' as const,
  website: '',
}

describe('contactFormSchema', () => {
  // 1. Defaults fail validation
  it('case 1: defaults fail validation', () => {
    const result = contactFormSchema.safeParse({
      name: '',
      email: '',
      mode: 'text',
      message: '',
      voiceRecordings: [],
      turnstileToken: '',
      interest: '',
      website: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0])
      expect(paths).toContain('name')
      expect(paths).toContain('email')
      expect(paths).toContain('turnstileToken')
      expect(paths).toContain('message')
    }
  })

  // 2. name < 2 chars → nameTooShort
  it('case 2: name < 2 chars → nameTooShort', () => {
    const result = contactFormSchema.safeParse({ ...validText, name: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameIssue = result.error.issues.find((issue) => issue.path[0] === 'name')
      expect(nameIssue?.message).toBe('nameTooShort')
    }
  })

  // 3. name = 81 chars → nameInvalid
  it('case 3: name = 81 chars → nameInvalid', () => {
    const result = contactFormSchema.safeParse({ ...validText, name: 'A'.repeat(81) })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameIssue = result.error.issues.find((issue) => issue.path[0] === 'name')
      expect(nameIssue?.message).toBe('nameInvalid')
    }
  })

  // 4. email empty → emailRequired
  it('case 4: email empty → emailRequired', () => {
    const result = contactFormSchema.safeParse({ ...validText, email: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((issue) => issue.path[0] === 'email')
      expect(emailIssue?.message).toBe('emailRequired')
    }
  })

  // 5. email malformed → emailInvalid
  it('case 5: email malformed → emailInvalid', () => {
    const result = contactFormSchema.safeParse({ ...validText, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((issue) => issue.path[0] === 'email')
      expect(emailIssue?.message).toBe('emailInvalid')
    }
  })

  // 6. email > 200 chars → emailInvalid
  it('case 6: email > 200 chars → emailInvalid', () => {
    const longEmail = `${'a'.repeat(196)}@b.co`
    const result = contactFormSchema.safeParse({ ...validText, email: longEmail })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((issue) => issue.path[0] === 'email')
      expect(emailIssue?.message).toBe('emailInvalid')
    }
  })

  // 7. Text mode: message 9 chars → messageRequired
  it('case 10: text mode message 9 chars → messageRequired', () => {
    const result = contactFormSchema.safeParse({ ...validText, message: 'A'.repeat(9) })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messageIssue = result.error.issues.find((issue) => issue.path[0] === 'message')
      expect(messageIssue?.message).toBe('messageRequired')
    }
  })

  // 11. Text mode: message 5001 chars → messageInvalid
  it('case 11: text mode message 5001 chars → messageInvalid', () => {
    const result = contactFormSchema.safeParse({ ...validText, message: 'A'.repeat(5001) })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messageIssue = result.error.issues.find((issue) => issue.path[0] === 'message')
      expect(messageIssue?.message).toBe('messageInvalid')
    }
  })

  // 12. Text mode: valid full payload
  it('case 12: text mode valid full payload → success', () => {
    const result = contactFormSchema.safeParse(validText)
    expect(result.success).toBe(true)
  })

  // 13. Voice mode: 0 recordings → voiceMissing
  it('case 13: voice mode 0 recordings → voiceMissing', () => {
    const result = contactFormSchema.safeParse({ ...validVoice, voiceRecordings: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      const voiceIssue = result.error.issues.find((issue) => issue.path[0] === 'voiceRecordings')
      expect(voiceIssue?.message).toBe('voiceMissing')
    }
  })

  // 14. Voice mode: 6 recordings → voiceTooMany
  it('case 14: voice mode 6 recordings → voiceTooMany', () => {
    const blobs = Array.from({ length: 6 }, () => makeBlob(1024))
    const result = contactFormSchema.safeParse({ ...validVoice, voiceRecordings: blobs })
    expect(result.success).toBe(false)
    if (!result.success) {
      const voiceIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'voiceRecordings' && issue.message === 'voiceTooMany',
      )
      expect(voiceIssue).toBeDefined()
    }
  })

  // 15. Voice mode: single blob > 5 MB → voiceTooLarge
  it('case 15: voice mode single blob > 5 MB → voiceTooLarge', () => {
    const result = contactFormSchema.safeParse({
      ...validVoice,
      voiceRecordings: [makeBlob(MAX_FILE_BYTES + 1)],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const voiceIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'voiceRecordings' && issue.message === 'voiceTooLarge',
      )
      expect(voiceIssue).toBeDefined()
    }
  })

  // 16. Voice mode: 5 × 5 MB = 25 MB total → voiceTooLarge
  it('case 16: voice mode 5 × 5 MB total → voiceTooLarge', () => {
    const blobs = Array.from({ length: 5 }, () => makeBlob(MAX_TOTAL_BYTES / 5 + 1))
    const result = contactFormSchema.safeParse({ ...validVoice, voiceRecordings: blobs })
    expect(result.success).toBe(false)
    if (!result.success) {
      const voiceIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'voiceRecordings' && issue.message === 'voiceTooLarge',
      )
      expect(voiceIssue).toBeDefined()
    }
  })

  // 17. Voice mode: valid (1 × 1 MB) → success
  it('case 17: voice mode valid single blob → success', () => {
    const result = contactFormSchema.safeParse(validVoice)
    expect(result.success).toBe(true)
  })

  // 18. interest enum accepts valid values
  it('case 22: interest accepts mvp / full-build / rescue / mentorship', () => {
    for (const interest of ['mvp', 'full-build', 'rescue', 'mentorship'] as const) {
      const result = contactFormSchema.safeParse({ ...validText, interest })
      expect(result.success).toBe(true)
    }
  })

  // 19. website (honeypot) non-empty → fails on max(0)
  it('case 19: website honeypot non-empty → fails', () => {
    const result = contactFormSchema.safeParse({ ...validText, website: 'spam' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const websiteIssue = result.error.issues.find((issue) => issue.path[0] === 'website')
      expect(websiteIssue).toBeDefined()
    }
  })

  // 20. turnstileToken empty → 'turnstile'
  it('case 20: turnstileToken empty → turnstile error', () => {
    const result = contactFormSchema.safeParse({ ...validText, turnstileToken: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const tokenIssue = result.error.issues.find((issue) => issue.path[0] === 'turnstileToken')
      expect(tokenIssue?.message).toBe('turnstile')
    }
  })

  // 23. interest enum rejects unknown values
  it('case 23: unknown interest rejected', () => {
    const result = contactFormSchema.safeParse({ ...validText, interest: 'other' })
    expect(result.success).toBe(false)
  })

  // 21. trim applied to name/email/message
  it('case 21: trim applied — whitespace-padded inputs pass', () => {
    const result = contactFormSchema.safeParse({
      ...validText,
      name: '  Alice  ',
      email: '  alice@example.com  ',
      message: '  This is a valid message with enough content.  ',
    })
    expect(result.success).toBe(true)
  })
})
