import { vi } from 'vitest'

export const sendContactEmail = vi.fn()

vi.mock('../../../app/_home/contact/email-client', () => ({ sendContactEmail }))
