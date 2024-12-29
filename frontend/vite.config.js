import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './frontend', // Set the root directory for your project (if your index.html is in the root of 'frontend')
  build: {
    outDir: '../dist', // Output directory for the build
  },
})
