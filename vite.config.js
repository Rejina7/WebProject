import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use the frontend folder as the app root
  root: 'frontend',
  // Keep serving assets from the top-level public folder
  publicDir: '../public',
})
