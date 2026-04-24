import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactElement } from 'react'

vi.mock('server-only', () => ({}))

const sendMock = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

import { sendContactEmail } from './email-client'

const baseParams = {
  to: 'inbox@test.com',
  from: 'from@test.com',
  replyTo: 'reply@test.com',
  subject: 'Hello',
  react: null as unknown as ReactElement,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.stubEnv('RESEND_API_KEY', 'test-api-key')
})

describe('sendContactEmail', () => {
  it('returns { id } from Resend response', async () => {
    sendMock.mockResolvedValue({ data: { id: 'msg_abc_123' }, error: null })
    const result = await sendContactEmail(baseParams)
    expect(result).toEqual({ id: 'msg_abc_123' })
  })

  it('throws when Resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'boom' } })
    await expect(sendContactEmail(baseParams)).rejects.toEqual({ message: 'boom' })
  })

  it('throws when Resend returns no id', async () => {
    sendMock.mockResolvedValue({ data: null, error: null })
    await expect(sendContactEmail(baseParams)).rejects.toThrow('Resend returned no message id')
  })

  it('throws when RESEND_API_KEY is missing', async () => {
    vi.unstubAllEnvs()
    // Force a fresh client construction by re-importing — module-level cache
    // means the API key check only runs on first use when client is null.
    vi.resetModules()
    const { sendContactEmail: freshSend } = await import('./email-client')
    await expect(freshSend(baseParams)).rejects.toThrow('RESEND_API_KEY is not configured')
  })
})
