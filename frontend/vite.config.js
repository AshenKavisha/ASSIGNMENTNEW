import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/login': { target: 'http://localhost:8080', changeOrigin: true },
      '/logout': { target: 'http://localhost:8080', changeOrigin: true },
      '/register': { target: 'http://localhost:8080', changeOrigin: true },
      '/dashboard': { target: 'http://localhost:8080', changeOrigin: true },
      '/admin': { target: 'http://localhost:8080', changeOrigin: true },
      '/assignments': { target: 'http://localhost:8080', changeOrigin: true },
      '/verify': { target: 'http://localhost:8080', changeOrigin: true },
      '/forgot-password': { target: 'http://localhost:8080', changeOrigin: true },
      '/resend-verification': { target: 'http://localhost:8080', changeOrigin: true },
      // NOTE: /reset-password is intentionally NOT proxied
      // The backend redirects to localhost:5173/reset-password directly
      // so React handles it without going back to the backend
    }
  }
})