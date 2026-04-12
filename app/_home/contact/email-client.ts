import 'server-only'

import type { ReactElement } from 'react'
import { Resend } from 'resend'

type Attachment = {
  filename: string
  content: Buffer
}

type SendParams = {
  to: string
  from: string
  replyTo: string
  subject: string
  react: ReactElement
  attachments?: Attachment[]
}

let client: Resend | null = null

function getClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
    client = new Resend(apiKey)
  }
  return client
}

export async function sendContactEmail(params: SendParams) {
  const resend = getClient()
  const { data, error } = await resend.emails.send({
    from: params.from,
    to: params.to,
    replyTo: params.replyTo,
    subject: params.subject,
    react: params.react,
    attachments: params.attachments,
  })
  if (error) throw error
  return data
}
