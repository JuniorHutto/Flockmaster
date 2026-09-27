import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker port mapping
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000' // Local dev: run the API from ./server
    },
    watch: {
      usePolling: true // Helps with file changes in some Docker environments
    }
  }
});