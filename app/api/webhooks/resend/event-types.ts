import 'server-only'

import { z } from 'zod'

// Common envelope fields. Resend events all share `type` + `created_at` + `data`.
// We model each `data` shape with the fields we actually use; unknown extras
// pass through (we don't `.strict()`).

const deliveryDataSchema = z.object({
  email_id: z.string(),
  from: z.string().optional(),
  to: z.array(z.string()).optional(),
  subject: z.string().optional(),
  created_at: z.string().optional(),
})

const bounceDataSchema = deliveryDataSchema.extend({
  bounce: z
    .object({
      type: z.string().optional(),
      subType: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
})

const complaintDataSchema = deliveryDataSchema.extend({
  complaint: z
    .object({
      feedback_type: z.string().optional(),
    })
    .optional(),
})

const inboundAttachmentSchema = z.object({
  filename: z.string(),
  content_type: z.string().optional(),
  // Base64-encoded payload from Resend.
  content: z.string(),
})

const inboundDataSchema = z.object({
  // Resend Inbound assigns its own id; we don't strictly require it.
  email_id: z.string().optional(),
  from: z.string(),
  to: z.union([z.string(), z.array(z.string())]),
  subject: z.string().optional().default(''),
  text: z.string().optional(),
  html: z.string().optional(),
  attachments: z.array(inboundAttachmentSchema).optional().default([]),
})

export const resendEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email.delivered'),
    created_at: z.string().optional(),
    data: deliveryDataSchema,
  }),
  z.object({
    type: z.literal('email.bounced'),
    created_at: z.string().optional(),
    data: bounceDataSchema,
  }),
  z.object({
    type: z.literal('email.complained'),
    created_at: z.string().optional(),
    data: complaintDataSchema,
  }),
  z.object({
    type: z.literal('email.inbound'),
    created_at: z.string().optional(),
    data: inboundDataSchema,
  }),
])

export type ResendEvent = z.infer<typeof resendEventSchema>
export type ResendDeliveryEvent = Extract<
  ResendEvent,
  { type: 'email.delivered' | 'email.bounced' | 'email.complained' }
>
export type ResendInboundEvent = Extract<ResendEvent, { type: 'email.inbound' }>
export type ResendInboundAttachment = z.infer<typeof inboundAttachmentSchema>
