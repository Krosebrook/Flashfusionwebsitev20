# Deployment Checklist

**Version being deployed:** vX.Y.Z  
**Target environment:** Staging / Production  
**Date:** YYYY-MM-DD  
**Engineer:** _name_

---

## Pre-Deployment

### Code Quality
- [ ] Release PR has been approved by ≥ 1 reviewer
- [ ] All CI checks passing (lint, type-check, tests, security audit)
- [ ] No `console.log` in the diff
- [ ] No secrets or API keys in the diff

### Environment Variables
- [ ] All `VITE_*` environment variables set in Vercel for target environment
- [ ] `VITE_APP_ENV` is set to `production` for production deploys
- [ ] Supabase URL and anon key are the production values (not staging)
- [ ] AI API keys set if required features are enabled

### Supabase
- [ ] Database migrations applied to target Supabase project: `supabase db push`
- [ ] RLS policies reviewed for new/changed tables
- [ ] Auth redirect URLs allowlist updated with production domain
- [ ] No breaking schema changes without a migration

### Build Verification
- [ ] `npm run build` completes without errors locally
- [ ] Bundle sizes reviewed — no unexpected size increase > 20%
- [ ] `npm audit` passes with no high/critical issues

---

## During Deployment

- [ ] Monitor Vercel deployment logs for errors
- [ ] Confirm deployment status is `Ready` in Vercel dashboard (< 5 minutes)
- [ ] Vercel deployment URL noted: `___________________________`

---

## Post-Deployment Smoke Tests

Run within 15 minutes of deployment.

| Test | Expected Result | Pass? |
|---|---|---|
| Homepage loads (`/`) | HTTP 200, page renders | ☐ |
| Login page loads (`/login`) | HTTP 200, form visible | ☐ |
| Sign up flow completes | User created, redirected to dashboard | ☐ |
| Login with email/password | User authenticated, dashboard loads | ☐ |
| Supabase health endpoint | HTTP 200 | ☐ |
| No error spike in Sentry (15 min post-deploy) | Error rate ≤ baseline | ☐ |
| Core Web Vitals — LCP | ≤ 2.5s | ☐ |

---

## Rollback Decision

If any post-deployment smoke test fails, initiate rollback immediately.

**Rollback action:**
1. Open Vercel dashboard → Deployments
2. Find last known-good deployment
3. Click **...** → **Promote to Production**
4. Re-run smoke tests

---

## Sign-off

| Role | Name | Sign-off |
|---|---|---|
| Deploying Engineer | | ☐ |
| Engineering Lead (for major releases) | | ☐ |

---

**Deployment completed:** YYYY-MM-DD HH:MM UTC  
**Result:** ✅ Success / ❌ Rolled back (reason: ___)
