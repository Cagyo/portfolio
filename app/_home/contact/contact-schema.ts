import { z } from 'zod'
import { INTEREST_VALUES } from './contact-types'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024

const baseFields = {
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  website: z.string().max(0),
  turnstileToken: z.string().min(1),
  interest: z.enum(INTEREST_VALUES).optional(),
}

const voiceFileMeta = z.object({
  name: z.string(),
  size: z.number().int().positive().max(MAX_FILE_BYTES),
  type: z.string().refine(
    (mime) => mime.startsWith('audio/'),
    { message: 'invalidAudioType' },
  ),
})

const textSchema = z.object({
  mode: z.literal('text'),
  ...baseFields,
  message: z.string().trim().min(10).max(5000),
  voiceRecordings: z.array(voiceFileMeta).max(0),
})

const voiceSchema = z.object({
  mode: z.literal('voice'),
  ...baseFields,
  message: z.string().optional(),
  voiceRecordings: z
    .array(voiceFileMeta)
    .min(1)
    .max(5)
    .refine(
      (files) => files.reduce((sum, file) => sum + file.size, 0) <= MAX_TOTAL_BYTES,
      { message: 'voiceTooLarge' },
    ),
})

export const contactSchema = z.discriminatedUnion('mode', [textSchema, voiceSchema])
export type ContactInput = z.infer<typeof contactSchema>
