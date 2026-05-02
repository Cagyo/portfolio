export type ContactErrorKey =
  | 'nameInvalid'
  | 'emailInvalid'
  | 'messageInvalid'
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

export const INTEREST_VALUES = ['mvp', 'full-build', 'rescue', 'mentorship'] as const
export type Interest = (typeof INTEREST_VALUES)[number]

export type ContactEmailData = {
  name: string
  email: string
  message?: string
  interest?: Interest
  ref?: string
  mode: 'text' | 'voice'
  recordingCount: number
}
