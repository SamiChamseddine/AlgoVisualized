import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Serve the app from the root
  build: {
    outDir: '../backend/static',  // Output to the static folder in the Django backend
  },
});
