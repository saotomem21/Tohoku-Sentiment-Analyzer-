import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // ポート番号を5175に変更
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  root: './src',
  publicDir: '../public',
  base: '/'
})
