import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,  // ← разреши внешние подключения
    allowedHosts: [
      'explore-thing-riders-totally.trycloudflare.com',  // ← твоя ссылка Cloudflare
      '.trycloudflare.com',  // ← или разреши все *.trycloudflare.com
    ],
  },
})
