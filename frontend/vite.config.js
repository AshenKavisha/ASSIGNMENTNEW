import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      '/feedback': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      // /login is NOT proxied — React Router handles GET /login
      // Login form submits to /api/auth/login which is covered by /api proxy above
      '/logout': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      '/register': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      '/verify': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      '/forgot-password': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      '/resend-verification': { target: 'http://localhost:8080', changeOrigin: true, secure: false, cookieDomainRewrite: 'localhost' },
      // NOTE: /reset-password is intentionally NOT proxied
      // The backend redirects to localhost:5173/reset-password directly
      // so React handles it without going back to the backend

      // NOTE: /dashboard, /admin, /assignments are intentionally NOT proxied
      // These are React Router routes handled by the frontend
    }
  }
})