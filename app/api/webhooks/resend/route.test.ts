import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'standardwebhooks'

vi.mock('server-only', () => ({}))
vi.mock('@/app/_home/contact/email-client', () => ({
  sendContactEmail: vi.fn(),
}))

import { sendContactEmail } from '@/app/_home/contact/email-client'
import { POST, GET } from './route'

const mockSendContactEmail = sendContactEmail as ReturnType<typeof vi.fn>

// Standard Webhooks expects a Base64-encoded secret (whatsec_<base64>);
// `whsec_` is the historical Svix prefix. Either is accepted.
const SECRET = 'whsec_' + Buffer.from('a-fake-test-secret-32-bytes-long!').toString('base64')

function signRequest(payload: object): { body: string; headers: Headers } {
  const body = JSON.stringify(payload)
  const wh = new Webhook(SECRET)
  const id = `msg_${Math.random().toString(36).slice(2)}`
  const timestamp = new Date()
  const signature = wh.sign(id, timestamp, body)
  const headers = new Headers({
    'webhook-id': id,
    'webhook-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
    'webhook-signature': signature,
    'content-type': 'application/json',
  })
  return { body, headers }
}

function makePostRequest(body: string, headers: Headers): Request {
  return new Request('https://example.com/api/webhooks/resend', {
    method: 'POST',
    headers,
    body,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.stubEnv('RESEND_WEBHOOK_SECRET', SECRET)
  vi.stubEnv('CONTACT_INBOX_EMAIL', 'inbox@test.com')
  vi.stubEnv('RESEND_FROM_EMAIL', 'from@test.com')
  mockSendContactEmail.mockResolvedValue({ id: 'alert_msg_999' })
})

describe('POST /api/webhooks/resend', () => {
  it('returns 401 when signature headers are missing', async () => {
    const req = makePostRequest('{}', new Headers({ 'content-type': 'application/json' }))
    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it('returns 401 when signature is invalid (body tampered)', async () => {
    const { headers } = signRequest({ type: 'email.delivered', data: { email_id: 'm1' } })
    const req = makePostRequest('{"type":"email.delivered","data":{"email_id":"tampered"}}', headers)
    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it('returns 200 for unknown event type without sending email', async () => {
    const { body, headers } = signRequest({ type: 'email.opened', data: { email_id: 'm1' } })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it('returns 200 for email.delivered and does NOT send an alert', async () => {
    const { body, headers } = signRequest({
      type: 'email.delivered',
      created_at: '2026-04-23T12:00:00Z',
      data: { email_id: 'msg_1', to: ['user@example.com'] },
    })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it('email.bounced → sends alert with correct subject + recipient', async () => {
    const { body, headers } = signRequest({
      type: 'email.bounced',
      created_at: '2026-04-23T12:00:00Z',
      data: {
        email_id: 'msg_b1',
        to: ['bounced@example.com'],
        bounce: { type: 'hard', message: 'mailbox does not exist' },
      },
    })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    const call = mockSendContactEmail.mock.calls[0][0]
    expect(call.to).toBe('inbox@test.com')
    expect(call.from).toBe('from@test.com')
    expect(call.subject).toBe('[Portfolio] Bounce: bounced@example.com')
  })

  it('email.complained → sends alert with complaint subject', async () => {
    const { body, headers } = signRequest({
      type: 'email.complained',
      created_at: '2026-04-23T12:00:00Z',
      data: {
        email_id: 'msg_c1',
        to: ['complainer@example.com'],
        complaint: { feedback_type: 'abuse' },
      },
    })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    const call = mockSendContactEmail.mock.calls[0][0]
    expect(call.subject).toBe('[Portfolio] Spam complaint: complainer@example.com')
  })

  it('email.inbound → forwards with attachments decoded from base64', async () => {
    const attachmentBytes = Buffer.from('hello world')
    const { body, headers } = signRequest({
      type: 'email.inbound',
      created_at: '2026-04-23T12:00:00Z',
      data: {
        from: 'sender@example.com',
        to: 'hello@berliziev.dev',
        subject: 'Question',
        text: 'Hi there!',
        attachments: [
          {
            filename: 'note.txt',
            content_type: 'text/plain',
            content: attachmentBytes.toString('base64'),
          },
        ],
      },
    })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    const call = mockSendContactEmail.mock.calls[0][0]
    expect(call.to).toBe('inbox@test.com')
    expect(call.replyTo).toBe('sender@example.com')
    expect(call.subject).toBe('[Inbound] Question')
    expect(call.attachments).toHaveLength(1)
    expect(call.attachments[0].filename).toBe('note.txt')
    expect(Buffer.isBuffer(call.attachments[0].content)).toBe(true)
    expect(call.attachments[0].content.toString()).toBe('hello world')
  })

  it('email.inbound with no attachments → forwards without attachments key', async () => {
    const { body, headers } = signRequest({
      type: 'email.inbound',
      data: {
        from: 'sender@example.com',
        to: ['hello@berliziev.dev'],
        subject: 'No files',
        text: 'just text',
        attachments: [],
      },
    })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(200)
    const call = mockSendContactEmail.mock.calls[0][0]
    expect(call.attachments).toBeUndefined()
  })

  it('GET returns 405', async () => {
    const res = GET()
    expect(res.status).toBe(405)
  })

  it('returns 401 when RESEND_WEBHOOK_SECRET is missing', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('CONTACT_INBOX_EMAIL', 'inbox@test.com')
    vi.stubEnv('RESEND_FROM_EMAIL', 'from@test.com')
    const { body, headers } = signRequest({ type: 'email.delivered', data: { email_id: 'm' } })
    const res = await POST(makePostRequest(body, headers))
    expect(res.status).toBe(401)
  })
})
