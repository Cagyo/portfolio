import { vi } from 'vitest'

export type AudioMockInstance = {
  play: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  src: string
  duration: number
  currentTime: number
  fireLoadedMetadata: (duration?: number) => void
  fireTimeUpdate: (currentTime: number, duration: number) => void
  fireEnded: () => void
}

export function installAudioMock(): AudioMockInstance[] {
  const instances: AudioMockInstance[] = []

  class MockAudio {
    src: string
    duration = 5
    currentTime = 0
    play = vi.fn().mockResolvedValue(undefined)
    pause = vi.fn()

    private _onloadedmetadata: (() => void) | null = null
    private _ontimeupdate: (() => void) | null = null
    private _onended: (() => void) | null = null

    get onloadedmetadata() { return this._onloadedmetadata }
    set onloadedmetadata(cb) { this._onloadedmetadata = cb }
    get ontimeupdate() { return this._ontimeupdate }
    set ontimeupdate(cb) { this._ontimeupdate = cb }
    get onended() { return this._onended }
    set onended(cb) { this._onended = cb }

    fireLoadedMetadata(duration = 5) {
      this.duration = duration
      this._onloadedmetadata?.()
    }

    fireTimeUpdate(currentTime: number, duration: number) {
      this.currentTime = currentTime
      this.duration = duration
      this._ontimeupdate?.()
    }

    fireEnded() {
      this._onended?.()
    }

    constructor(src = '') {
      this.src = src
      instances.push(this as unknown as AudioMockInstance)
    }
  }

  vi.stubGlobal('Audio', MockAudio)
  return instances
}
