import { z } from 'zod'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, 'nameTooShort').max(80, 'nameInvalid'),
    email: z.string().trim().min(1, 'emailRequired').email('emailInvalid').max(200, 'emailInvalid'),
    mode: z.enum(['text', 'voice']),
    subject: z.string().trim().max(150, 'subjectInvalid'),
    budget: z.enum(['', '5k', '15k', '50k', 'discuss']),
    message: z.string().trim().max(5000, 'messageInvalid'),
    voiceRecordings: z.array(z.instanceof(Blob)),
    turnstileToken: z.string().min(1, 'turnstile'),
    website: z.string().max(0),
  })
  .superRefine((values, ctx) => {
    if (values.mode === 'text') {
      if (values.subject.length < 2)
        ctx.addIssue({ code: 'custom', path: ['subject'], message: 'subjectRequired' })
      if (values.message.length < 10)
        ctx.addIssue({ code: 'custom', path: ['message'], message: 'messageRequired' })
    } else {
      if (values.voiceRecordings.length < 1)
        ctx.addIssue({ code: 'custom', path: ['voiceRecordings'], message: 'voiceMissing' })
      if (values.voiceRecordings.length > 5)
        ctx.addIssue({ code: 'custom', path: ['voiceRecordings'], message: 'voiceTooMany' })
      const total = values.voiceRecordings.reduce((sum, blob) => sum + blob.size, 0)
      if (total > MAX_TOTAL_BYTES)
        ctx.addIssue({ code: 'custom', path: ['voiceRecordings'], message: 'voiceTooLarge' })
      if (values.voiceRecordings.some((blob) => blob.size > MAX_FILE_BYTES))
        ctx.addIssue({ code: 'custom', path: ['voiceRecordings'], message: 'voiceTooLarge' })
    }
  })

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const contactFormDefaultValues: ContactFormValues = {
  name: '',
  email: '',
  mode: 'text',
  subject: '',
  budget: '',
  message: '',
  voiceRecordings: [],
  turnstileToken: '',
  website: '',
}
