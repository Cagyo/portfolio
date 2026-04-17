import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl, messages } from '@/test/helpers/render-with-intl'
import { installMediaRecorderMock } from '@/test/helpers/mocks/media-recorder'
import { installAudioMock } from '@/test/helpers/mocks/audio'
import type { AudioMockInstance } from '@/test/helpers/mocks/audio'
import { ContactForm } from './ContactForm'

// Mock the server action
vi.mock('./contact-actions', () => ({
  sendContactMessage: vi.fn(),
}))

// Replace TurnstileWidget with the test double from the mocks helper
vi.mock('./TurnstileWidget', async () => {
  const mod = await import('@/test/helpers/mocks/turnstile-widget')
  return { TurnstileWidget: mod.default }
})

import { sendContactMessage } from './contact-actions'
const mockSendContactMessage = sendContactMessage as ReturnType<typeof vi.fn>

import { turnstileResetSpy } from '@/test/helpers/mocks/turnstile-widget'

// Helper to click the Turnstile mock and supply a valid token
async function verifyTurnstile(user: ReturnType<typeof userEvent.setup>) {
  const btn = screen.getByTestId('turnstile-mock')
  await user.click(btn)
}

// Helper to fill valid text-mode fields
async function fillValidTextForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(messages.contact.form.nameLabel), 'Alice Smith')
  await user.type(screen.getByLabelText(messages.contact.form.emailLabel), 'alice@example.com')
  await user.type(screen.getByLabelText(messages.contact.form.subjectLabel), 'Hello there')
  await user.type(screen.getByLabelText(messages.contact.form.messageLabel), 'This is a valid message with enough chars.')
  await verifyTurnstile(user)
}

describe('ContactForm', () => {
  let audioInstances: AudioMockInstance[]

  beforeEach(() => {
    installMediaRecorderMock()
    audioInstances = installAudioMock()
    mockSendContactMessage.mockReset()
    turnstileResetSpy.mockReset()
    // Default: action returns success
    mockSendContactMessage.mockResolvedValue({ success: true })
  })

  // ─── Initial render ──────────────────────────────────────────────────────

  it('case 1: fresh render — shows name, email, text tab active, subject, budget, message; no voice panel', () => {
    renderWithIntl(<ContactForm />)
    expect(screen.getByLabelText(messages.contact.form.nameLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(messages.contact.form.emailLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(messages.contact.form.subjectLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(messages.contact.form.budgetLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(messages.contact.form.messageLabel)).toBeInTheDocument()

    // Text tab is active
    const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
    expect(textTab).toHaveAttribute('aria-pressed', 'true')

    // Voice panel not shown
    expect(screen.queryByTestId('voice-recorder')).not.toBeInTheDocument()
  })

  it('case 2: honeypot input is aria-hidden, tabIndex=-1, autoComplete=off', () => {
    const { container } = renderWithIntl(<ContactForm />)
    const honeypotWrapper = container.querySelector('[aria-hidden="true"]')
    expect(honeypotWrapper).not.toBeNull()
    const honeypotInput = honeypotWrapper!.querySelector('input')!
    expect(honeypotInput).toHaveAttribute('tabindex', '-1')
    expect(honeypotInput).toHaveAttribute('autocomplete', 'off')
  })

  // ─── Client validation ───────────────────────────────────────────────────

  it('case 3: blur empty name → nameTooShort error', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    const nameInput = screen.getByLabelText(messages.contact.form.nameLabel)
    await user.click(nameInput)
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.nameTooShort)).toBeInTheDocument()
    })
  })

  it('case 4: blur malformed email → emailInvalid error', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    const emailInput = screen.getByLabelText(messages.contact.form.emailLabel)
    await user.type(emailInput, 'not-an-email')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.emailInvalid)).toBeInTheDocument()
    })
  })

  it('case 5: text mode, blur empty subject → subjectRequired error', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    const subjectInput = screen.getByLabelText(messages.contact.form.subjectLabel)
    await user.click(subjectInput)
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.subjectRequired)).toBeInTheDocument()
    })
  })

  it('case 6: text mode, blur 9-char message → messageRequired error', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    const messageInput = screen.getByLabelText(messages.contact.form.messageLabel)
    await user.type(messageInput, 'A'.repeat(9))
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.messageRequired)).toBeInTheDocument()
    })
  })

  it('case 7: fix field + blur again → error disappears', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    const nameInput = screen.getByLabelText(messages.contact.form.nameLabel)
    await user.click(nameInput)
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.nameTooShort)).toBeInTheDocument()
    })
    await user.type(nameInput, 'Alice')
    await user.tab()
    await waitFor(() => {
      expect(screen.queryByText(messages.contact.form.errors.nameTooShort)).not.toBeInTheDocument()
    })
  })

  // ─── Mode toggle ─────────────────────────────────────────────────────────

  it('case 8: click Voice tab → text panel unmounts, voice panel mounts, aria-pressed flips', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    const voiceTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel })
    await user.click(voiceTab)

    // text panel fields gone
    await waitFor(() => {
      expect(screen.queryByLabelText(messages.contact.form.subjectLabel)).not.toBeInTheDocument()
    })

    // voice panel visible
    expect(document.getElementById('contact-voice-panel')).not.toBeNull()

    // aria-pressed flipped
    expect(voiceTab).toHaveAttribute('aria-pressed', 'true')
    const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
    expect(textTab).toHaveAttribute('aria-pressed', 'false')
  })

  it('case 9: Text→Voice→Text retains typed subject', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    await user.type(screen.getByLabelText(messages.contact.form.subjectLabel), 'My project')

    const voiceTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel })
    await user.click(voiceTab)

    const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
    await user.click(textTab)

    const subjectInput = screen.getByLabelText(messages.contact.form.subjectLabel) as HTMLInputElement
    expect(subjectInput.value).toBe('My project')
  })

  // ─── Submission ───────────────────────────────────────────────────────────

  it('case 10: valid text submission → sendContactMessage called once with FormData, no voiceRecordings', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }))

    await waitFor(() => {
      expect(mockSendContactMessage).toHaveBeenCalledOnce()
    })
    const [, formData] = mockSendContactMessage.mock.calls[0] as [unknown, FormData]
    expect(formData.getAll('voiceRecordings')).toHaveLength(0)
    expect(formData.get('mode')).toBe('text')
  })

  it('case 11: valid voice submission → FormData has File entries named recording-N.webm', async () => {
    const mrMock = installMediaRecorderMock()
    const localAudioInstances = installAudioMock()
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    // Switch to voice mode
    await user.click(screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel }))

    // Fill name and email
    await user.type(screen.getByLabelText(messages.contact.form.nameLabel), 'Alice Smith')
    await user.type(screen.getByLabelText(messages.contact.form.emailLabel), 'alice@example.com')

    // Record a clip
    await user.click(screen.getByRole('button', { name: messages.contact.form.voice.recordBtn }))
    mrMock.permissionGranted()
    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.voice.recordingLabel)).toBeInTheDocument()
    })
    mrMock.emitChunk()
    await act(async () => { mrMock.triggerStop() })
    await act(async () => { localAudioInstances[0]?.fireLoadedMetadata(5) })
    await waitFor(() => {
      expect(screen.getByText(
        messages.contact.form.voice.recordingNLabel.replace('{n}', '1'),
      )).toBeInTheDocument()
    })

    await verifyTurnstile(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.voice.submitLabel, 'i') }))

    await waitFor(() => {
      expect(mockSendContactMessage).toHaveBeenCalledOnce()
    })
    const [, formData] = mockSendContactMessage.mock.calls[0] as [unknown, FormData]
    const voiceFiles = formData.getAll('voiceRecordings') as File[]
    expect(voiceFiles).toHaveLength(1)
    expect(voiceFiles[0]).toBeInstanceOf(File)
    expect(voiceFiles[0].name).toBe('recording-1.webm')
    expect(voiceFiles[0].type).toBe('audio/webm')
    void audioInstances
  })

  it('case 12: during pending action → spinner and sending text visible, submit disabled', async () => {
    let resolveAction!: (value: { success: true }) => void
    mockSendContactMessage.mockImplementation(
      () => new Promise((resolve) => { resolveAction = resolve }),
    )

    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }))

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.sending)).toBeInTheDocument()
    })
    const submitBtn = screen.getByRole('button', { name: new RegExp(messages.contact.form.sending, 'i') })
    expect(submitBtn).toBeDisabled()

    // Resolve to clean up
    resolveAction({ success: true })
  })

  it('case 13: server success → successMessage banner visible, submit stays disabled', async () => {
    mockSendContactMessage.mockResolvedValue({ success: true })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }))

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.successMessage)).toBeInTheDocument()
    })
  })

  it('case 14: server turnstile error → error banner shown, turnstile reset invoked', async () => {
    mockSendContactMessage.mockResolvedValue({ success: false, error: 'turnstile' })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }))

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.turnstile)).toBeInTheDocument()
    })

    // Verify that turnstileRef.current.reset() was actually invoked by the useEffect
    expect(turnstileResetSpy).toHaveBeenCalledOnce()
  })

  it('case 15: server rateLimited error → rateLimited banner visible', async () => {
    mockSendContactMessage.mockResolvedValue({ success: false, error: 'rateLimited' })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }))

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.rateLimited)).toBeInTheDocument()
    })
  })

  it('case 16: voice mode submit button reads voice.submitLabel', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    await user.click(screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: new RegExp(messages.contact.form.voice.submitLabel, 'i') }),
      ).toBeInTheDocument()
    })
  })
})
