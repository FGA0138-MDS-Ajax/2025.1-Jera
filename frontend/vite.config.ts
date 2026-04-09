import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api to your backend service
      '/api': {
        target: process.env.VITE_BACKEND_URL!, // Build-time configurable backend URL
        changeOrigin: true, // Recommended for virtual hosts
        // No rewrite needed, as we want to forward the /api prefix
      },
    },
  },
});