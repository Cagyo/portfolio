import { vi } from 'vitest'

type MediaRecorderMockControls = {
  permissionGranted: () => void
  permissionDenied: () => void
  emitChunk: (data?: Blob) => void
  triggerStop: () => void
  streamTrackStop: ReturnType<typeof vi.fn>
  createdUrls: string[]
  revokedUrls: string[]
  fireLoadedMetadata: (duration: number) => void
}

let urlCounter = 0
let uuidCounter = 0

export function installMediaRecorderMock(): MediaRecorderMockControls {
  const createdUrls: string[] = []
  const revokedUrls: string[] = []
  const streamTrackStop = vi.fn()

  let resolvePermission: (() => void) | null = null
  let rejectPermission: ((err: Error) => void) | null = null
  let pendingPermission: Promise<MediaStream> | null = null

  let currentInstance: {
    ondataavailable: ((event: { data: Blob }) => void) | null
    onstop: (() => void) | null
    start: ReturnType<typeof vi.fn>
    stop: ReturnType<typeof vi.fn>
  } | null = null

  class MockMediaRecorder {
    ondataavailable: ((event: { data: Blob }) => void) | null = null
    onstop: (() => void) | null = null
    start = vi.fn()
    stop = vi.fn()

    constructor(_stream: MediaStream) {
      currentInstance = this
    }
  }

  vi.stubGlobal('MediaRecorder', MockMediaRecorder)

  pendingPermission = new Promise<MediaStream>((resolve, reject) => {
    resolvePermission = () => {
      const track = { stop: streamTrackStop }
      resolve({ getTracks: () => [track] } as unknown as MediaStream)
    }
    rejectPermission = () =>
      reject(new DOMException('Permission denied', 'NotAllowedError'))
  })

  vi.stubGlobal('navigator', {
    ...globalThis.navigator,
    mediaDevices: {
      getUserMedia: vi.fn(() => {
        pendingPermission = new Promise<MediaStream>((resolve, reject) => {
          resolvePermission = () => {
            const track = { stop: streamTrackStop }
            resolve({ getTracks: () => [track] } as unknown as MediaStream)
          }
          rejectPermission = () =>
            reject(new DOMException('Permission denied', 'NotAllowedError'))
        })
        return pendingPermission
      }),
    },
  })

  vi.stubGlobal('URL', {
    ...globalThis.URL,
    createObjectURL: vi.fn((_blob: Blob) => {
      const url = `blob:test-${++urlCounter}`
      createdUrls.push(url)
      return url
    }),
    revokeObjectURL: vi.fn((url: string) => {
      revokedUrls.push(url)
    }),
  })

  vi.stubGlobal('crypto', {
    ...globalThis.crypto,
    randomUUID: vi.fn(() => `uuid-${++uuidCounter}`),
  })

  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)

  return {
    permissionGranted: () => resolvePermission?.(),
    permissionDenied: () => rejectPermission?.(new Error('denied')),
    emitChunk: (data = new Blob(['audio'], { type: 'audio/webm' })) => {
      currentInstance?.ondataavailable?.({ data })
    },
    triggerStop: () => {
      currentInstance?.onstop?.()
    },
    streamTrackStop,
    createdUrls,
    revokedUrls,
    fireLoadedMetadata: (duration: number) => {
      const audio = document.querySelector('audio')
      if (audio) {
        Object.defineProperty(audio, 'duration', { value: duration, configurable: true })
        audio.dispatchEvent(new Event('loadedmetadata'))
      }
    },
  }
}
