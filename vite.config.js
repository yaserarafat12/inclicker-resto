import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // penting buat Capacitor APK nanti
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})