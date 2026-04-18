export type ContactErrorKey =
  | 'nameInvalid'
  | 'emailInvalid'
  | 'subjectInvalid'
  | 'messageInvalid'
  | 'budgetInvalid'
  | 'voiceMissing'
  | 'voiceTooLarge'
  | 'voiceTooMany'
  | 'turnstile'
  | 'rateLimited'
  | 'sendFailed'
  | 'unknown'

export type ActionResult =
  | { success: true }
  | { success: false; error: ContactErrorKey }

export const INTEREST_VALUES = ['mvp', 'full-build', 'rescue'] as const
export type Interest = (typeof INTEREST_VALUES)[number]

export type ContactEmailData = {
  name: string
  email: string
  subject?: string
  budget?: string
  message?: string
  interest?: Interest
  mode: 'text' | 'voice'
  recordingCount: number
}
