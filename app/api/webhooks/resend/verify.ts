import 'server-only'

import { Webhook } from 'standardwebhooks'

export type WebhookHeaders = {
  'webhook-id': string
  'webhook-timestamp': string
  'webhook-signature': string
}

/**
 * Verify a Resend webhook request using the Standard Webhooks (Svix-compatible)
 * signature scheme. Throws on any verification failure (missing secret,
 * missing/invalid headers, bad signature, stale timestamp).
 *
 * IMPORTANT: `rawBody` must be the exact bytes received from the request — do
 * not re-serialize via `JSON.stringify(JSON.parse(...))`.
 */
export function verifyResendWebhook(rawBody: string, headers: Headers): void {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) throw new Error('RESEND_WEBHOOK_SECRET is not configured')

  const webhookId = headers.get('webhook-id')
  const webhookTimestamp = headers.get('webhook-timestamp')
  const webhookSignature = headers.get('webhook-signature')
  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    throw new Error('missing webhook signature headers')
  }

  const wh = new Webhook(secret)
  wh.verify(rawBody, {
    'webhook-id': webhookId,
    'webhook-timestamp': webhookTimestamp,
    'webhook-signature': webhookSignature,
  })
}
