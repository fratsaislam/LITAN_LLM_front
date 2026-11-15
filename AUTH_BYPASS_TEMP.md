# Temporary frontend auth bypass for screenshots

This folder contains a temporary development-only bypass that allows a user to skip the login flow and access the application UI for screenshots or demo capture.

## Files involved
- `src/authBypass.js`
- `src/hooks/useAuth.js`
- `src/App.jsx`

## How to enable it
Open the browser devtools console and run:

```js
localStorage.setItem('authBypass', 'true');
location.reload();
```

Then open the app and it will redirect to `/home` without requiring login.

## How to disable it later
Run:

```js
localStorage.removeItem('authBypass');
localStorage.removeItem('authToken');
localStorage.removeItem('role');
location.reload();
```

## How to undo the bypass completely
Remove the temporary logic from:
1. `src/App.jsx` — the conditional redirect from `/login` to `/home`
2. `src/hooks/useAuth.js` — the `isAuthBypassEnabled()` check
3. `src/authBypass.js` — delete the file entirely

After removing it, make sure the normal `ProtectedRoute` and auth check flow works again.

## Important
This bypass is meant only for local screenshot/report generation. Do not keep it in a production or shared branch.
