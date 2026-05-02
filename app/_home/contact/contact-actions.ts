'use server'

import { headers } from 'next/headers'
import { contactSchema } from './contact-schema'
import type { ActionResult, ContactErrorKey, ContactEmailData } from './contact-types'
import { checkRateLimit } from './rate-limit'
import { verifyTurnstile } from './turnstile-verify'
import { sendContactEmail } from './email-client'
import { MAX_TOTAL_BYTES } from './email-constants'
import { ContactEmail } from './ContactEmail'

function mapZodError(issues: { path: PropertyKey[]; message: string; code: string }[]): ContactErrorKey {
  const issue = issues[0]
  if (!issue) return 'unknown'

  const field = issue.path[0]

  if (field === 'website') return 'unknown'

  if (field === 'turnstileToken') return 'turnstile'

  if (field === 'voiceRecordings') {
    if (issue.message === 'voiceTooLarge') return 'voiceTooLarge'
    if (issue.code === 'too_small') return 'voiceMissing'
    if (issue.code === 'too_big') return 'voiceTooMany'
    return 'voiceTooLarge'
  }

  const fieldMap: Record<string, ContactErrorKey> = {
    name: 'nameInvalid',
    email: 'emailInvalid',
    message: 'messageInvalid',
  }

  return fieldMap[field as string] ?? 'unknown'
}

export async function sendContactMessage(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // 1. Honeypot — silent success so bots can't distinguish
  if (formData.get('website')) {
    return { success: true }
  }

  // 2. Extract IP
  const headerStore = await headers()
  const xff = headerStore.get('x-forwarded-for')
  const ip = xff?.split(',')[0]?.trim() || headerStore.get('x-real-ip') || 'unknown'

  // 3. Turnstile verification
  const turnstileToken = formData.get('turnstileToken') as string | null
  const turnstileResult = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileResult.ok) {
    return { success: false, error: 'turnstile' }
  }

  // 4. Rate limit
  const rateLimitResult = checkRateLimit(ip)
  if (!rateLimitResult.ok) {
    return { success: false, error: 'rateLimited' }
  }

  // 5. Extract voice files
  const voiceFiles = formData
    .getAll('voiceRecordings')
    .filter((entry): entry is File => entry instanceof File)

  // 6. Build parseable object for Zod
  const mode = formData.get('mode') as string
  const parseInput = {
    mode,
    name: formData.get('name') as string ?? '',
    email: formData.get('email') as string ?? '',
    website: formData.get('website') as string ?? '',
    turnstileToken: turnstileToken ?? '',
    interest: formData.get('interest') as string ?? undefined,
    ref: formData.get('ref') as string ?? undefined,
    message: formData.get('message') as string ?? undefined,
    voiceRecordings: voiceFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  }

  // 7. Validate
  const result = contactSchema.safeParse(parseInput)
  if (!result.success) {
    return { success: false, error: mapZodError(result.error.issues) }
  }

  // 8. Enforce aggregate file size (belt-and-suspenders alongside Zod)
  const totalSize = voiceFiles.reduce((sum, file) => sum + file.size, 0)
  if (totalSize > MAX_TOTAL_BYTES) {
    return { success: false, error: 'voiceTooLarge' }
  }

  // 9. Build attachments from voice files
  const attachments = await Promise.all(
    voiceFiles.map(async (file, index) => ({
      filename: `recording-${index + 1}.webm`,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  )

  // 10. Build email data
  const parsed = result.data
  const emailData: ContactEmailData = {
    name: parsed.name,
    email: parsed.email,
    message: 'message' in parsed ? parsed.message : undefined,
    interest: 'interest' in parsed ? parsed.interest : undefined,
    ref: 'ref' in parsed ? parsed.ref : undefined,
    mode: parsed.mode,
    recordingCount: voiceFiles.length,
  }

  const emailSubject =
    emailData.mode === 'voice'
      ? `[Portfolio] Voice message from ${emailData.name}`
      : `[Portfolio] Message from ${emailData.name}`

  const to = process.env.CONTACT_INBOX_EMAIL
  const from = process.env.RESEND_FROM_EMAIL
  if (!to || !from) {
    console.error({ tag: 'contact-action', kind: 'missing-env' })
    return { success: false, error: 'sendFailed' }
  }

  // 11. Send
  try {
    const sendResult = await sendContactEmail({
      to,
      from,
      replyTo: emailData.email,
      subject: emailSubject,
      react: ContactEmail({ data: emailData }),
      attachments: attachments.length > 0 ? attachments : undefined,
    })
    console.info({
      tag: 'contact-action',
      kind: 'send-success',
      messageId: sendResult.id,
      mode: emailData.mode,
    })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error({ tag: 'contact-action', kind: 'send-failed', errorName, errorMessage })
    return { success: false, error: 'sendFailed' }
  }

  return { success: true }
}
