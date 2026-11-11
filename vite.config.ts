import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages отдаёт сайт из подпапки репозитория: /tv-suggester/
  base: process.env.GITHUB_ACTIONS ? '/tv-suggester/' : '/',
  plugins: [react()],
})
