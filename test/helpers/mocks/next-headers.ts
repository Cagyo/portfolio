import { vi } from 'vitest'

export function mockNextHeaders(headers: Record<string, string> = {}) {
  vi.doMock('next/headers', () => ({
    headers: async () => new Headers(headers),
  }))
}
