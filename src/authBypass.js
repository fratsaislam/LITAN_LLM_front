// TEMPORARY SCREENSHOT BYPASS
// This is a development-only workaround to skip the login flow so screenshots can be taken
// inside the app UI without needing an authenticated session.
//
// To enable it in the browser console:
//   localStorage.setItem('authBypass', 'true')
//
// To disable it again:
//   localStorage.removeItem('authBypass')
//   localStorage.removeItem('authToken')
//   localStorage.removeItem('role')
//
// Undo this bypass by removing the import + checks from:
//   - src/App.jsx
//   - src/hooks/useAuth.js
//   - this file

export const AUTH_BYPASS_STORAGE_KEY = 'authBypass';

export function isAuthBypassEnabled() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_BYPASS_STORAGE_KEY) === 'true';
}

export function getBypassUser() {
  return {
    id: 'screenshot-bypass-user',
    email: 'screenshot@example.com',
    role: 'student',
    name: 'Screenshot Bypass User',
  };
}
