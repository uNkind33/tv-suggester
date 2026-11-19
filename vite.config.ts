import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages отдаёт сайт из подпапки репозитория: /tv-suggester/
  base: process.env.GITHUB_ACTIONS ? '/tv-suggester/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // в dev запросы к /api идут на локальный backend
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
