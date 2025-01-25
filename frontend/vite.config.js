import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust if Django serves static files from a subpath
  build: {
    outDir: 'dist', // Ensure this aligns with Django's STATICFILES_DIRS
    emptyOutDir: true,
  },
  server: {
    host: true, // Allow the server to be accessible externally
    port: process.env.PORT || 3000, // Use Railway's dynamic PORT or default to 3000
  },
});
