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
      // These are React Router routes handled by the frontend.
      //
      // EXCEPTION: the deliver-solution form POSTs directly to
      // /admin/assignments/{id}/deliver-solution (Spring MVC redirect handler
      // in AdminController, mapped under class-level @RequestMapping("/admin")).
      // We proxy ONLY POST requests matching that exact pattern to the backend;
      // GET requests to /admin/** still fall through to React Router untouched.
      '^/admin/assignments/\\d+/deliver-solution$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        bypass(req) {
          if (req.method !== 'POST') {
            return req.url;
          }
        }
      },

      // EXCEPTION: the "Request Revision" form on ViewAssignment.jsx POSTs
      // directly to /assignments/{id}/request-revision (another Spring MVC
      // redirect-based handler, same pattern as deliver-solution above).
      // We proxy ONLY POST requests matching this exact pattern to the backend;
      // GET requests to /assignments/** still fall through to React Router
      // untouched (needed for the assignment view page itself).
      '^/assignments/\\d+/request-revision$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        bypass(req) {
          if (req.method !== 'POST') {
            return req.url;
          }
        }
      },
    }
  }
})