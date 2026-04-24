import 'server-only'

import { sendContactEmail } from '@/app/_home/contact/email-client'
import { MAX_TOTAL_BYTES } from '@/app/_home/contact/email-constants'
import type { ResendInboundAttachment, ResendInboundEvent } from '../event-types'
import { ForwardedInboundEmail } from './ForwardedInboundEmail'

// Trust boundary: inbound senders are unauthenticated. Attachments are
// forwarded as-is (no MIME filtering) because the inbound address is private
// and the destination inbox is operator-owned. Revisit if the address is ever
// published or auto-discovered.

function decodeAttachment(att: ResendInboundAttachment): { filename: string; content: Buffer } {
  return {
    filename: att.filename,
    content: Buffer.from(att.content, 'base64'),
  }
}

function normalizeTo(to: string | string[]): string {
  if (Array.isArray(to)) return to.join(', ')
  return to
}

export async function handleInboundEvent(event: ResendInboundEvent): Promise<void> {
  const inbound = event.data
  const timestamp = event.created_at ?? new Date().toISOString()
  const inboundTo = normalizeTo(inbound.to)

  console.info({
    tag: 'resend-webhook',
    kind: 'email.inbound',
    from: inbound.from,
    to: inboundTo,
    subject: inbound.subject,
    attachmentCount: inbound.attachments.length,
    timestamp,
  })

  const to = process.env.CONTACT_INBOX_EMAIL
  const from = process.env.RESEND_FROM_EMAIL
  if (!to || !from) {
    console.error({ tag: 'resend-webhook', kind: 'missing-env', event: event.type })
    return
  }

  // Decode + size-cap attachments. Drop overflow rather than fail the forward
  // entirely — the body still carries the message content.
  const decoded: { filename: string; content: Buffer }[] = []
  let runningBytes = 0
  for (const att of inbound.attachments) {
    const next = decodeAttachment(att)
    if (runningBytes + next.content.byteLength > MAX_TOTAL_BYTES) {
      console.warn({
        tag: 'resend-webhook',
        kind: 'attachment-dropped',
        filename: next.filename,
        reason: 'total-size-exceeded',
      })
      continue
    }
    runningBytes += next.content.byteLength
    decoded.push(next)
  }

  const subjectLine = `[Inbound] ${inbound.subject || '(no subject)'}`

  try {
    const result = await sendContactEmail({
      to,
      from,
      replyTo: inbound.from,
      subject: subjectLine,
      react: ForwardedInboundEmail({
        from: inbound.from,
        to: inboundTo,
        subject: inbound.subject,
        text: inbound.text,
        attachmentNames: decoded.map((att) => att.filename),
      }),
      attachments: decoded.length > 0 ? decoded : undefined,
    })
    console.info({
      tag: 'resend-webhook',
      kind: 'inbound-forwarded',
      forwardedMessageId: result.id,
      attachmentCount: decoded.length,
    })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error({
      tag: 'resend-webhook',
      kind: 'inbound-forward-failed',
      errorName,
      errorMessage,
    })
  }
}
