/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    legacy()
  ],
  resolve: {
    alias: {
      // The styling variant (spec 001 §13.4, D13): `--mode matched` builds `matched`, every other mode `stock`.
      // `tsconfig.json` maps the path to `stock` for type checking; both `setup.ts` files export the same type.
      '@style': fileURLToPath(new URL(`./src/styles/${mode === 'matched' ? 'matched' : 'stock'}`, import.meta.url)),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
}))
