import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    // Resolve 'server-only' to an empty virtual module so server-side
    // guard imports don't fail during Vite transforms in the test environment.
    {
      name: 'vitest-server-only',
      enforce: 'pre' as const,
      resolveId(id: string) {
        if (id === 'server-only') return '\0virtual:server-only'
      },
      load(id: string) {
        if (id === '\0virtual:server-only') return ''
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: false,
    include: ['app/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // no `include` — only files exercised by tests appear; contact/ threshold fires once Plan 2 imports those files
      exclude: [
        'app/**/*.d.ts',
        'app/**/page.tsx',
        'app/**/layout.tsx',
        'app/**/loading.tsx',
        'app/**/not-found.tsx',
        'app/**/*.module.css',
      ],
      thresholds: {
        'app/_home/contact/**': {
          lines: 90,
          branches: 85,
          functions: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
