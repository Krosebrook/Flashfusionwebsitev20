# Troubleshooting & Known Issues

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** All

---

## Table of Contents

1. [Development Environment Issues](#1-development-environment-issues)
2. [Build & Deploy Issues](#2-build--deploy-issues)
3. [Authentication Issues](#3-authentication-issues)
4. [Supabase Issues](#4-supabase-issues)
5. [Runtime / UI Issues](#5-runtime--ui-issues)
6. [Performance Issues](#6-performance-issues)
7. [Known Issues & Workarounds](#7-known-issues--workarounds)
8. [Getting Help](#8-getting-help)

---

## 1. Development Environment Issues

### Dev server won't start

**Symptoms:** `npm run dev` exits immediately or hangs.

**Steps:**
1. Verify Node.js version: `node --version` (must be 18.x+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Check that `.env.local` exists and has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### TypeScript errors on startup

**Symptoms:** `Cannot find module '@/...'` or similar path errors.

**Steps:**
1. Ensure `tsconfig.json` has the path alias configured: `"@/*": ["./src/*"]`
2. Restart the TypeScript language server in your editor (VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server")
3. Run `npm run type-check` to see all errors at once

### Hot module replacement (HMR) not working

**Symptoms:** Changes to files do not update the browser automatically.

**Steps:**
1. Check the terminal for HMR error messages.
2. Restart the dev server.
3. If on WSL2 (Windows), ensure the project is inside the WSL filesystem, not a Windows-mounted path (`/mnt/c/...`).

---

## 2. Build & Deploy Issues

### `npm run build` fails with TypeScript errors

**Symptoms:** Vite exits with type errors during the build.

**Steps:**
1. Run `npm run type-check` to see the exact errors.
2. Fix all TypeScript errors before retrying the build.
3. Ensure `"strict": true` in `tsconfig.json` is met by all source files.

### Build succeeds but app is blank in production

**Symptoms:** White screen on production URL; no error in terminal.

**Steps:**
1. Open browser DevTools → Console tab and note any errors.
2. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel environment variables.
3. Ensure `vercel.json` has the SPA rewrite rule (`"source": "/(.*)", "destination": "/index.html"`).
4. Check the Vercel deployment logs for build-time errors.

### Vercel deploy stuck / timed out

**Steps:**
1. Check Vercel dashboard for error details.
2. Try redeploying manually: `vercel --prod` from CLI.
3. If the build itself hangs, check for circular imports or missing async boundaries.

---

## 3. Authentication Issues

### Login redirects to an error page after OAuth

**Symptoms:** After GitHub or Google sign-in, user is redirected to an error page.

**Steps:**
1. Verify the **Redirect URL** is allowlisted in Supabase → Authentication → URL Configuration.
2. For local dev: `http://localhost:5173/**` must be in the allowed list.
3. Verify the OAuth App credentials (client ID + secret) are set in Supabase.

### User is stuck in redirect loop

**Symptoms:** Navigating to any page immediately redirects to `/login`, even when logged in.

**Steps:**
1. Open DevTools → Application → Local Storage and check for `supabase.auth.token`.
2. If missing, the session was lost — sign in again.
3. If present but looping, there may be an issue with the `ProtectedRoute` component — check the auth context initialisation.

### Email confirmation link expired

**Symptoms:** "Token has expired or is invalid" on the confirmation page.

**Steps:**
1. Request a new confirmation email from the login page.
2. If this happens frequently, consider increasing the OTP expiry time in Supabase → Authentication → Email → OTP Expiry.

---

## 4. Supabase Issues

### "Invalid API key" error

**Symptoms:** API calls to Supabase return 401 Unauthorized.

**Steps:**
1. Double-check `VITE_SUPABASE_ANON_KEY` in `.env.local` matches the key in Supabase → Settings → API.
2. Ensure you are using the **anon/public** key, not the `service_role` key.
3. Restart the dev server after changing `.env.local`.

### RLS blocking legitimate queries

**Symptoms:** A Supabase query returns 0 results even though data exists.

**Steps:**
1. Check that the user is authenticated: log `supabase.auth.getUser()` in the console.
2. Open the Supabase SQL editor and test the query with `set role authenticated; select * from your_table where user_id = 'your-user-id';`
3. Review the RLS policies for the table in Supabase → Database → Tables → [table] → Policies.

### Realtime not receiving events

**Symptoms:** Live updates are not appearing.

**Steps:**
1. Check the browser console for WebSocket connection errors.
2. Verify that Realtime is enabled for the table in Supabase → Database → Replication.
3. Check that the subscription filter matches the data being changed.

---

## 5. Runtime / UI Issues

### Component renders blank / crashes silently

**Symptoms:** A component area is blank with no visible error.

**Steps:**
1. Check the browser console for error messages.
2. Look for an `ErrorBoundaryEnhanced` component wrapping the area — it may be swallowing the error.
3. Temporarily remove the error boundary to expose the underlying error.

### Fonts or icons not loading

**Symptoms:** Icons appear as squares; fonts fall back to system default.

**Steps:**
1. Check the network tab for failed resource loads.
2. If using web fonts from an external CDN, ensure the CSP `style-src` and `font-src` directives include the CDN domain.

### Navigation does not work after deployment

**Symptoms:** Direct URL access (e.g., `/dashboard`) returns a 404 on production.

**Solution:** Ensure the `vercel.json` SPA rewrite rule is present (see [Build & Deploy Issues](#2-build--deploy-issues)).

---

## 6. Performance Issues

### Slow initial page load

**Symptoms:** Time to interactive > 3 seconds on a fast connection.

**Steps:**
1. Run `npm run build` and check bundle sizes in `dist/assets/`.
2. Use Lighthouse in Chrome DevTools to identify large JS bundles.
3. Ensure route-level code splitting is applied to all page components.
4. Check for accidental imports of large libraries at the top level (e.g., importing all of `lodash`).

### Memory leak / increasing memory usage

**Symptoms:** Browser tab memory grows over time; the `MemoryMonitor` component shows escalating usage.

**Steps:**
1. Check for `useEffect` hooks that register event listeners without cleanup functions.
2. Verify Supabase Realtime subscriptions are unsubscribed on component unmount.
3. Look for closures that hold references to large objects.

---

## 7. Known Issues & Workarounds

| Issue | Severity | Status | Workaround |
|---|---|---|---|
| Bundle size above target (Grade C– audit) | High | In progress | Enable route-level code splitting for all pages |
| Several AI tool features are placeholder-only | High | Planned (Q2 2026) | UI shows "Coming Soon" indicator |
| WCAG 2.1 AA accessibility gaps in some components | Medium | Planned | Use keyboard nav; screen readers partially supported |
| Mobile layout broken on some pages (< 375px) | Medium | In progress | View affected pages on 390px+ viewport |
| No server-side rendering (SEO impact) | Medium | Under evaluation (Next.js migration) | Prerender landing pages via Vercel Edge |
| `supabase-js` v2 deprecated subscribe API in some paths | Low | Accepted | Upgrade to latest `@supabase/supabase-js` minor |
| Storybook stories are incomplete for many components | Low | Planned | Reference source component code directly |

---

## 8. Getting Help

| Channel | Use For |
|---|---|
| [GitHub Issues](https://github.com/Krosebrook/Flashfusionwebsitev20/issues) | Bug reports, feature requests |
| [GitHub Discussions](https://github.com/Krosebrook/Flashfusionwebsitev20/discussions) | Questions, ideas, general discussion |
| Code review PR comments | Questions about specific code changes |

When filing a bug report, include:

1. Steps to reproduce
2. Expected behaviour
3. Actual behaviour
4. Browser, OS, and Node.js version
5. Relevant console errors or screenshots

Use the [Bug Report Template](./templates/bug-report.md).

---

*Last Updated: 2026-03-08 | Owner: Engineering / QA*
