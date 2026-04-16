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

    constructor(src = '') {
      this.src = src
      const self = this
      instances.push({
        get play() { return self.play },
        get pause() { return self.pause },
        get src() { return self.src },
        get duration() { return self.duration },
        get currentTime() { return self.currentTime },
        fireLoadedMetadata: (duration = 5) => {
          self.duration = duration
          self._onloadedmetadata?.()
        },
        fireTimeUpdate: (currentTime, dur) => {
          self.currentTime = currentTime
          self.duration = dur
          self._ontimeupdate?.()
        },
        fireEnded: () => {
          self._onended?.()
        },
      })
    }
  }

  vi.stubGlobal('Audio', MockAudio)
  return instances
}
