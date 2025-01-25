import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Serve the app from the root
  build: {
    outDir: 'dist',  // Output to the static folder in the Django backend
    emptyOutDir: true,
  },
  server: {
    port: process.env.PORT || 3000,  // Use Railway's PORT or fallback to 3000
  },
  preview: {
    port: process.env.PORT || 3000,  // Use Railway's PORT or fallback to 3000
  },
});
