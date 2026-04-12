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

export type ContactEmailData = {
  name: string
  email: string
  subject?: string
  budget?: string
  message?: string
  mode: 'text' | 'voice'
  recordingCount: number
}
