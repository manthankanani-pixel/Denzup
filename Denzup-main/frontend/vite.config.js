import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/danzup-logo.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/hardik.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/akash.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/hero-dancer.jpeg': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
