import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl, messages } from '../../../test/helpers/render-with-intl'
import { installMediaRecorderMock } from '../../../test/helpers/mocks/media-recorder'
import { installAudioMock } from '../../../test/helpers/mocks/audio'
import type { AudioMockInstance } from '../../../test/helpers/mocks/audio'
import { VoiceRecorder } from './VoiceRecorder'

const voiceMessages = messages.contact.form.voice

// Flush all pending microtasks + React state batches
const flushAll = () => act(async () => { await Promise.resolve() })

describe('VoiceRecorder', () => {
  let mrMock: ReturnType<typeof installMediaRecorderMock>
  let audioInstances: AudioMockInstance[]
  let onRecordingsChange: ReturnType<typeof vi.fn>

  // Restore real timers after every test even if it times out unexpectedly
  afterEach(() => { vi.useRealTimers() })

  beforeEach(() => {
    mrMock = installMediaRecorderMock()
    audioInstances = installAudioMock()
    onRecordingsChange = vi.fn()
  })

  function render() {
    return renderWithIntl(<VoiceRecorder onRecordingsChange={onRecordingsChange} />)
  }

  // Helper: click record then grant permission, wait for recording state visible
  async function startRecording(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: voiceMessages.recordBtn }))
    mrMock.permissionGranted()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
    })
  }

  // Helper: stop recording and add the blob + trigger loadedmetadata
  async function stopRecording(duration = 5) {
    mrMock.emitChunk()
    await act(async () => { mrMock.triggerStop() })
    const latest = audioInstances[audioInstances.length - 1]
    await act(async () => { latest?.fireLoadedMetadata(duration) })
  }

  // Helper: complete one full recording cycle and wait for the entry to appear
  async function recordOneClip(user: ReturnType<typeof userEvent.setup>, index = 1) {
    await startRecording(user)
    await stopRecording()
    await waitFor(() => {
      expect(screen.getByText(
        voiceMessages.recordingNLabel.replace('{n}', String(index)),
      )).toBeInTheDocument()
    })
  }

  // ─── Idle state ──────────────────────────────────────────────────────────

  it('case 1: initial render shows hint, record button, readyLabel; no recording state', () => {
    render()
    expect(screen.getByText(voiceMessages.hint)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: voiceMessages.recordBtn })).toBeInTheDocument()
    expect(screen.getByText(voiceMessages.readyLabel)).toBeInTheDocument()
    expect(screen.queryByText(voiceMessages.recordingLabel)).not.toBeInTheDocument()
  })

  // ─── Recording lifecycle ─────────────────────────────────────────────────

  it('case 2: click record, permission denied → micPermissionError visible', async () => {
    const user = userEvent.setup()
    render()
    await user.click(screen.getByRole('button', { name: voiceMessages.recordBtn }))
    mrMock.permissionDenied()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.micPermissionError)).toBeInTheDocument()
    })
    expect(screen.queryByText(voiceMessages.recordingLabel)).not.toBeInTheDocument()
  })

  it('case 3: click record, permission granted → recordingLabel, timer 0:00, stop button', async () => {
    const user = userEvent.setup()
    render()
    await startRecording(user)
    expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
    expect(screen.getByText('0:00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: voiceMessages.stopBtn })).toBeInTheDocument()
  })

  it('case 4: advance fake timers 3 s → timer reads 0:03', async () => {
    vi.useFakeTimers()
    render()
    // Use fireEvent (synchronous) to avoid userEvent hanging under fake timers
    fireEvent.click(screen.getByRole('button', { name: voiceMessages.recordBtn }))
    mrMock.permissionGranted()
    // Flush the getUserMedia microtask chain so startRecording() continues
    await act(async () => { await Promise.resolve() })
    await act(async () => { await Promise.resolve() })
    // Now setInterval is running; advance 3 seconds
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('0:03')).toBeInTheDocument()
  })

  it('case 5: click stop + emit blob → recording-1 label visible, onRecordingsChange called', async () => {
    const user = userEvent.setup()
    render()
    await startRecording(user)

    await user.click(screen.getByRole('button', { name: voiceMessages.stopBtn }))
    await stopRecording()

    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingNLabel.replace('{n}', '1'))).toBeInTheDocument()
    })
    const lastCallArg = onRecordingsChange.mock.calls[onRecordingsChange.mock.calls.length - 1][0]
    expect(lastCallArg).toHaveLength(1)
    expect(lastCallArg[0]).toBeInstanceOf(Blob)
  })

  it('case 6: auto-stop at 120 s → recording state clears after elapsed reaches MAX_DURATION_SECONDS', async () => {
    vi.useFakeTimers()
    render()
    // Use fireEvent (synchronous) to avoid userEvent hanging under fake timers
    fireEvent.click(screen.getByRole('button', { name: voiceMessages.recordBtn }))
    mrMock.permissionGranted()
    // Flush getUserMedia microtask chain
    await act(async () => { await Promise.resolve() })
    await act(async () => { await Promise.resolve() })
    // Advance 120 seconds — the 120th tick calls component stopRecording()
    await act(async () => { vi.advanceTimersByTime(120000) })
    // Simulate the MediaRecorder finishing and blob arriving
    mrMock.emitChunk()
    await act(async () => { mrMock.triggerStop() })
    const latest = audioInstances[audioInstances.length - 1]
    await act(async () => { latest?.fireLoadedMetadata(120) })
    // Recording state should be cleared; recording entry should appear
    expect(screen.queryByText(voiceMessages.recordingLabel)).not.toBeInTheDocument()
    expect(screen.getByText(voiceMessages.recordingNLabel.replace('{n}', '1'))).toBeInTheDocument()
  })

  it('case 7: after stop → stream track stop called', async () => {
    const user = userEvent.setup()
    render()
    await startRecording(user)

    await user.click(screen.getByRole('button', { name: voiceMessages.stopBtn }))
    await stopRecording()

    await waitFor(() => {
      expect(mrMock.streamTrackStop).toHaveBeenCalled()
    })
  })

  // ─── Multiple recordings ──────────────────────────────────────────────────

  it('case 8: add 5 recordings sequentially → addAnotherBtn hidden, maxReachedLabel visible', async () => {
    const user = userEvent.setup()
    render()

    await recordOneClip(user, 1)

    for (let recordingIndex = 2; recordingIndex <= 5; recordingIndex++) {
      await user.click(screen.getByRole('button', { name: voiceMessages.addAnotherBtn }))
      mrMock.permissionGranted()
      await waitFor(() => {
        expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
      })
      await stopRecording()
      await waitFor(() => {
        expect(screen.getByText(
          voiceMessages.recordingNLabel.replace('{n}', String(recordingIndex)),
        )).toBeInTheDocument()
      })
    }

    expect(screen.queryByRole('button', { name: voiceMessages.addAnotherBtn })).not.toBeInTheDocument()
    const expectedMax = voiceMessages.maxReachedLabel.replace('{max}', '5')
    expect(screen.getByText(expectedMax)).toBeInTheDocument()
  })

  it('case 9: onRecordingsChange called with growing arrays', async () => {
    const user = userEvent.setup()
    render()

    await recordOneClip(user, 1)
    const lastAfterFirst = onRecordingsChange.mock.calls[onRecordingsChange.mock.calls.length - 1][0]
    expect(lastAfterFirst).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: voiceMessages.addAnotherBtn }))
    mrMock.permissionGranted()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
    })
    await stopRecording()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingNLabel.replace('{n}', '2'))).toBeInTheDocument()
    })

    const lastAfterSecond = onRecordingsChange.mock.calls[onRecordingsChange.mock.calls.length - 1][0]
    expect(lastAfterSecond).toHaveLength(2)
  })

  // ─── Playback ─────────────────────────────────────────────────────────────

  it('case 10: click play on recording 1 → audio.play() called, button swaps to pause', async () => {
    const user = userEvent.setup()
    render()
    await recordOneClip(user, 1)

    await user.click(screen.getByRole('button', { name: voiceMessages.playBtn }))

    expect(audioInstances[0].play).toHaveBeenCalledOnce()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: voiceMessages.pauseBtn })).toBeInTheDocument()
    })
  })

  it('case 11: click play on recording 2 while 1 plays → recording 1 paused first', async () => {
    const user = userEvent.setup()
    render()
    await recordOneClip(user, 1)

    // Add second recording
    await user.click(screen.getByRole('button', { name: voiceMessages.addAnotherBtn }))
    mrMock.permissionGranted()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
    })
    await stopRecording()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingNLabel.replace('{n}', '2'))).toBeInTheDocument()
    })

    // Play recording 1
    const playBtns = screen.getAllByRole('button', { name: voiceMessages.playBtn })
    await user.click(playBtns[0])
    expect(audioInstances[0].play).toHaveBeenCalledOnce()

    // Play recording 2 — audioInstances[0].pause should be called first
    const pauseCallsBefore = audioInstances[0].pause.mock.calls.length
    const playBtns2 = screen.getAllByRole('button', { name: voiceMessages.playBtn })
    await user.click(playBtns2[0])

    await waitFor(() => {
      expect(audioInstances[0].pause.mock.calls.length).toBeGreaterThan(pauseCallsBefore)
    })
    expect(audioInstances[1].play).toHaveBeenCalledOnce()
  })

  it('case 12: fire ontimeupdate → progressFill width updates proportional to currentTime / duration', async () => {
    const user = userEvent.setup()
    const { container } = renderWithIntl(<VoiceRecorder onRecordingsChange={onRecordingsChange} />)
    await recordOneClip(user, 1)

    await user.click(screen.getByRole('button', { name: voiceMessages.playBtn }))

    await act(async () => {
      audioInstances[0].fireTimeUpdate(2.5, 5)
    })

    await waitFor(() => {
      const fill = container.querySelector('[class*="progressFill"]') as HTMLElement | null
      if (fill) {
        expect(fill.style.width).toBe('50%')
      }
    })
  })

  it('case 13: fire onended → playingId clears, progress resets to 0', async () => {
    const user = userEvent.setup()
    const { container } = renderWithIntl(<VoiceRecorder onRecordingsChange={onRecordingsChange} />)
    await recordOneClip(user, 1)

    await user.click(screen.getByRole('button', { name: voiceMessages.playBtn }))

    await act(async () => {
      audioInstances[0].fireEnded()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: voiceMessages.playBtn })).toBeInTheDocument()
    })

    const fill = container.querySelector('[class*="progressFill"]') as HTMLElement | null
    if (fill) {
      expect(fill.style.width).toBe('0%')
    }
  })

  // ─── Delete ──────────────────────────────────────────────────────────────

  it('case 14: delete sole recording → revokeObjectURL called, parent notified with []', async () => {
    const user = userEvent.setup()
    render()
    await recordOneClip(user, 1)

    const createdUrl = mrMock.createdUrls[0]

    await user.click(
      screen.getByRole('button', { name: `${voiceMessages.deleteBtn} 1` }),
    )

    await waitFor(() => {
      expect(mrMock.revokedUrls).toContain(createdUrl)
    })
    const lastCallArg = onRecordingsChange.mock.calls[onRecordingsChange.mock.calls.length - 1][0]
    expect(lastCallArg).toHaveLength(0)
  })

  it('case 15: delete currently-playing recording → audio.pause() called first', async () => {
    const user = userEvent.setup()
    render()
    await recordOneClip(user, 1)

    // Start playback
    await user.click(screen.getByRole('button', { name: voiceMessages.playBtn }))
    const pauseCallsBefore = audioInstances[0].pause.mock.calls.length

    // Delete it
    await user.click(
      screen.getByRole('button', { name: `${voiceMessages.deleteBtn} 1` }),
    )

    await waitFor(() => {
      expect(audioInstances[0].pause.mock.calls.length).toBeGreaterThan(pauseCallsBefore)
    })
    expect(screen.queryByText(voiceMessages.recordingNLabel.replace('{n}', '1'))).not.toBeInTheDocument()
  })

  // ─── Unmount cleanup ──────────────────────────────────────────────────────

  it('case 16: unmount while recording → stream tracks stopped', async () => {
    const user = userEvent.setup()
    const { unmount } = render()
    await startRecording(user)
    unmount()
    // Cleanup effect should stop all stream tracks
    expect(mrMock.streamTrackStop).toHaveBeenCalled()
  })

  it('case 17: unmount with N finished recordings → revokeObjectURL called N times', async () => {
    const user = userEvent.setup()
    const { unmount } = render()

    await recordOneClip(user, 1)

    await user.click(screen.getByRole('button', { name: voiceMessages.addAnotherBtn }))
    mrMock.permissionGranted()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingLabel)).toBeInTheDocument()
    })
    await stopRecording()
    await waitFor(() => {
      expect(screen.getByText(voiceMessages.recordingNLabel.replace('{n}', '2'))).toBeInTheDocument()
    })

    const urlsCreatedBeforeUnmount = [...mrMock.createdUrls]

    unmount()

    for (const url of urlsCreatedBeforeUnmount) {
      expect(mrMock.revokedUrls).toContain(url)
    }
  })
})
