import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // lets you use describe, test, expect without importing them every time
    setupFiles: './src/setupTests.js', // sets up custom DOM matchers
    include: ['src/**/*.test.{js,jsx}'], // Forces Vitest to scan .jsx test files in src
  },
})