import 'server-only'

import { sendContactEmail } from '@/app/_home/contact/email-client'
import type { ResendDeliveryEvent } from '../event-types'
import { BounceAlertEmail } from './BounceAlertEmail'

function firstRecipient(to: string[] | undefined): string {
  if (!to || to.length === 0) return 'unknown'
  return to[0]
}

export async function handleDeliveryEvent(event: ResendDeliveryEvent): Promise<void> {
  const messageId = event.data.email_id
  const recipient = firstRecipient(event.data.to)
  const timestamp = event.created_at ?? new Date().toISOString()

  console.info({
    tag: 'resend-webhook',
    kind: event.type,
    messageId,
    to: recipient,
    timestamp,
  })

  if (event.type === 'email.delivered') return

  const to = process.env.CONTACT_INBOX_EMAIL
  const from = process.env.RESEND_FROM_EMAIL
  if (!to || !from) {
    console.error({ tag: 'resend-webhook', kind: 'missing-env', event: event.type })
    return
  }

  let subject: string
  let reason: string | undefined
  let detail: string | undefined

  if (event.type === 'email.bounced') {
    subject = `[Portfolio] Bounce: ${recipient}`
    reason = event.data.bounce?.type
    detail = event.data.bounce?.message
  } else {
    subject = `[Portfolio] Spam complaint: ${recipient}`
    reason = event.data.complaint?.feedback_type
  }

  try {
    const result = await sendContactEmail({
      to,
      from,
      replyTo: from,
      subject,
      react: BounceAlertEmail({
        variant: event.type === 'email.bounced' ? 'bounce' : 'complaint',
        recipient,
        messageId,
        timestamp,
        reason,
        detail,
      }),
    })
    console.info({
      tag: 'resend-webhook',
      kind: 'alert-sent',
      eventType: event.type,
      alertMessageId: result.id,
      originalMessageId: messageId,
    })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error({
      tag: 'resend-webhook',
      kind: 'alert-failed',
      eventType: event.type,
      originalMessageId: messageId,
      errorName,
      errorMessage,
    })
  }
}
