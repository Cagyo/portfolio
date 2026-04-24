import 'server-only'

import { resendEventSchema } from './event-types'
import { handleDeliveryEvent } from './handlers/delivery'
import { handleInboundEvent } from './handlers/inbound'
import { verifyResendWebhook } from './verify'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request): Promise<Response> {
  // 1. Read raw body — Standard Webhooks signs the exact bytes received.
  const rawBody = await request.text()

  // 2. Verify signature.
  try {
    verifyResendWebhook(rawBody, request.headers)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid signature'
    console.warn({ tag: 'resend-webhook', kind: 'verify-failed', message })
    return new Response('invalid signature', { status: 401 })
  }

  // 3. Parse JSON.
  let json: unknown
  try {
    json = JSON.parse(rawBody)
  } catch {
    console.warn({ tag: 'resend-webhook', kind: 'invalid-json' })
    // Body verified by signature but not valid JSON — accept to drain queue.
    return new Response('ok', { status: 200 })
  }

  // 4. Discriminate. Unknown event types intentionally pass through as 200
  // so Resend doesn't retry forever.
  const parsed = resendEventSchema.safeParse(json)
  if (!parsed.success) {
    const eventType =
      typeof json === 'object' && json !== null && 'type' in json
        ? (json as { type: unknown }).type
        : undefined
    console.info({
      tag: 'resend-webhook',
      kind: 'unhandled-event',
      eventType,
    })
    return new Response('ok', { status: 200 })
  }

  // 5. Dispatch.
  try {
    const event = parsed.data
    if (event.type === 'email.inbound') {
      await handleInboundEvent(event)
    } else {
      await handleDeliveryEvent(event)
    }
    return new Response('ok', { status: 200 })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error({
      tag: 'resend-webhook',
      kind: 'handler-error',
      eventType: parsed.data.type,
      errorName,
      errorMessage,
    })
    return new Response('handler error', { status: 500 })
  }
}

// Reject all non-POST methods explicitly.
export function GET(): Response {
  return new Response('method not allowed', { status: 405 })
}

export function PUT(): Response {
  return GET()
}

export function PATCH(): Response {
  return GET()
}

export function DELETE(): Response {
  return GET()
}
