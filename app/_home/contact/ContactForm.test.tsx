import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl, messages } from '@/test/helpers/render-with-intl'
import { installMediaRecorderMock } from '@/test/helpers/mocks/media-recorder'
import { installAudioMock } from '@/test/helpers/mocks/audio'
import type { AudioMockInstance } from '@/test/helpers/mocks/audio'
import { ContactForm } from './ContactForm'

// next/navigation — `useSearchParams` returns a value the test controls.
// Default = empty params. Per-test overrides via `setSearchParams`.
let searchParamsValue = new URLSearchParams()
function setSearchParams(input: string) {
  searchParamsValue = new URLSearchParams(input)
}
vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsValue,
}))

// Mock the server action
vi.mock('./contact-actions', () => ({
  sendContactMessage: vi.fn(),
}))

vi.mock('@/app/_analytics/analytics', () => ({
  trackContactSubmitSuccess: vi.fn(),
  trackContactSuccessCtaClick: vi.fn(),
}))

// Replace TurnstileWidget with the test double from the mocks helper
vi.mock('./TurnstileWidget', async () => {
  const mod = await import('@/test/helpers/mocks/turnstile-widget')
  return { TurnstileWidget: mod.default }
})

import { sendContactMessage } from './contact-actions'
const mockSendContactMessage = sendContactMessage as ReturnType<typeof vi.fn>

import { trackContactSubmitSuccess } from '@/app/_analytics/analytics'
const mockTrackContactSubmitSuccess = trackContactSubmitSuccess as ReturnType<typeof vi.fn>

import { turnstileResetSpy } from '@/test/helpers/mocks/turnstile-widget'

// Helper to click the Turnstile mock and supply a valid token
async function verifyTurnstile(user: ReturnType<typeof userEvent.setup>) {
  const btn = screen.getByTestId('turnstile-mock')
  await user.click(btn)
}

// Helper to switch from the default voice mode into text mode.
async function switchToText(user: ReturnType<typeof userEvent.setup>) {
  const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
  await user.click(textTab)
}

// Helper to fill valid text-mode fields.
// Form starts in voice mode by default (siteConfig.contactDefaultMode = 'voice'),
// so we always switch to text first.
async function fillValidTextForm(user: ReturnType<typeof userEvent.setup>) {
  await switchToText(user)
  await user.type(screen.getByLabelText(messages.contact.form.nameLabel), 'Alice Smith')
  await user.type(screen.getByLabelText(messages.contact.form.emailLabel), 'alice@example.com')
  await user.type(
    screen.getByLabelText(messages.contact.form.messageLabel),
    'This is a valid message with enough chars.',
  )
  await verifyTurnstile(user)
}

describe('ContactForm', () => {
  let audioInstances: AudioMockInstance[]

  beforeEach(() => {
    installMediaRecorderMock()
    audioInstances = installAudioMock()
    mockSendContactMessage.mockReset()
    mockTrackContactSubmitSuccess.mockReset()
    turnstileResetSpy.mockReset()
    setSearchParams('')
    // Default: action returns success
    mockSendContactMessage.mockResolvedValue({ success: true })
  })

  // ─── Initial render ──────────────────────────────────────────────────────

  it('case 1: fresh render — voice tab pressed by default, mic record button visible, no message field', () => {
    renderWithIntl(<ContactForm />)
    expect(screen.getByLabelText(messages.contact.form.nameLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(messages.contact.form.emailLabel)).toBeInTheDocument()

    // Voice tab is active by default
    const voiceTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel })
    expect(voiceTab).toHaveAttribute('aria-pressed', 'true')

    // Mic record button visible (voice panel mounted)
    expect(
      screen.getByRole('button', { name: messages.contact.form.voice.recordBtn }),
    ).toBeInTheDocument()

    // No message label (text panel not mounted)
    expect(screen.queryByLabelText(messages.contact.form.messageLabel)).not.toBeInTheDocument()
  })

  it('case 2: honeypot input is aria-hidden, tabIndex=-1, autoComplete=off', () => {
    const { container } = renderWithIntl(<ContactForm />)
    const honeypotWrapper = container.querySelector('[aria-hidden="true"]')
    expect(honeypotWrapper).not.toBeNull()
    const honeypotInput = honeypotWrapper!.querySelector('input')!
    expect(honeypotInput).toHaveAttribute('tabindex', '-1')
    expect(honeypotInput).toHaveAttribute('autocomplete', 'off')
  })

  // ─── Client validation (mode-independent fields above the toggle) ────────

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

  it('case 6: text mode, blur 9-char message → messageRequired error', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await switchToText(user)
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

  it('case 8: click Text tab → voice panel unmounts, text panel mounts, aria-pressed flips', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
    await user.click(textTab)

    // Text panel mounted (message label appears)
    await waitFor(() => {
      expect(screen.getByLabelText(messages.contact.form.messageLabel)).toBeInTheDocument()
    })

    // Voice panel mic-record button gone
    expect(
      screen.queryByRole('button', { name: messages.contact.form.voice.recordBtn }),
    ).not.toBeInTheDocument()

    // aria-pressed flipped
    expect(textTab).toHaveAttribute('aria-pressed', 'true')
    const voiceTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel })
    expect(voiceTab).toHaveAttribute('aria-pressed', 'false')
  })

  it('case 9: Text→Voice→Text retains typed message', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)

    await switchToText(user)
    await user.type(screen.getByLabelText(messages.contact.form.messageLabel), 'My project')

    const voiceTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.voiceLabel })
    await user.click(voiceTab)

    const textTab = screen.getByRole('button', { name: messages.contact.form.modeTabs.typeLabel })
    await user.click(textTab)

    const messageInput = screen.getByLabelText(
      messages.contact.form.messageLabel,
    ) as HTMLTextAreaElement
    expect(messageInput.value).toBe('My project')
  })

  // ─── Submission ───────────────────────────────────────────────────────────

  it('case 10: valid text submission → sendContactMessage called once with FormData, no voiceRecordings', async () => {
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(
      screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }),
    )

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

    // Voice mode is the default — no tab click needed.

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
      expect(
        screen.getByText(messages.contact.form.voice.recordingNLabel.replace('{n}', '1')),
      ).toBeInTheDocument()
    })

    await verifyTurnstile(user)

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(messages.contact.form.voice.submitLabel, 'i'),
      }),
    )

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

    await user.click(
      screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }),
    )

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.sending)).toBeInTheDocument()
    })
    const submitBtn = screen.getByRole('button', {
      name: new RegExp(messages.contact.form.sending, 'i'),
    })
    expect(submitBtn).toBeDisabled()

    // Resolve to clean up
    resolveAction({ success: true })
  })

  it('case 13: server success → success heading + 3 CTA links visible', async () => {
    mockSendContactMessage.mockResolvedValue({ success: true })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(
      screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }),
    )

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.successHeading)).toBeInTheDocument()
    })

    expect(
      screen.getByRole('link', { name: messages.contact.form.successCtas.calendly }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: messages.contact.form.successCtas.linkedin }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: messages.contact.form.successCtas.projects }),
    ).toBeInTheDocument()

    expect(mockTrackContactSubmitSuccess).toHaveBeenCalledExactlyOnceWith('text')
  })

  it('case 14: server turnstile error → error banner shown, turnstile reset invoked', async () => {
    mockSendContactMessage.mockResolvedValue({ success: false, error: 'turnstile' })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(
      screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }),
    )

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.turnstile)).toBeInTheDocument()
    })

    expect(turnstileResetSpy).toHaveBeenCalledOnce()
  })

  it('case 15: server rateLimited error → rateLimited banner visible', async () => {
    mockSendContactMessage.mockResolvedValue({ success: false, error: 'rateLimited' })
    const user = userEvent.setup()
    renderWithIntl(<ContactForm />)
    await fillValidTextForm(user)

    await user.click(
      screen.getByRole('button', { name: new RegExp(messages.contact.form.submit, 'i') }),
    )

    await waitFor(() => {
      expect(screen.getByText(messages.contact.form.errors.rateLimited)).toBeInTheDocument()
    })
  })

  it('case 16: voice mode submit button reads voice.submitLabel', async () => {
    renderWithIntl(<ContactForm />)
    // Voice is the default — no mode click needed.
    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: new RegExp(messages.contact.form.voice.submitLabel, 'i'),
        }),
      ).toBeInTheDocument()
    })
  })

  // ─── Deep-link via ?interest= ────────────────────────────────────────────

  it('case 17: ?interest=mentorship deep-link selects the mentorship option', async () => {
    setSearchParams('interest=mentorship')
    renderWithIntl(<ContactForm />)
    await waitFor(() => {
      const select = screen.getByLabelText(
        messages.contact.form.interestLabel,
      ) as HTMLSelectElement
      expect(select.value).toBe('mentorship')
    })
  })
})
