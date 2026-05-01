import { z } from 'zod'
import { siteConfig } from '@/app/_config/site-config'
import { INTEREST_VALUES } from './contact-types'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, 'nameTooShort').max(80, 'nameInvalid'),
    email: z.string().trim().min(1, 'emailRequired').email('emailInvalid').max(200, 'emailInvalid'),
    mode: z.enum(['text', 'voice']),
    message: z.string().trim().max(5000, 'messageInvalid'),
    voiceRecordings: z.array(z.instanceof(Blob)),
    turnstileToken: z.string().min(1, 'turnstile'),
    interest: z.enum(['', ...INTEREST_VALUES]),
    website: z.string().max(0),
  })
  .superRefine((values, ctx) => {
    if (values.mode === 'text') {
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
  mode: siteConfig.contactDefaultMode,
  message: '',
  voiceRecordings: [],
  turnstileToken: '',
  interest: '',
  website: '',
}
