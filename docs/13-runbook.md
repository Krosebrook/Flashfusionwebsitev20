# Operational Runbook

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** DevOps, On-call Engineers

This runbook provides step-by-step procedures for operating FlashFusion in production.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Health Checks](#2-health-checks)
3. [Deployment Procedures](#3-deployment-procedures)
4. [Rollback Procedure](#4-rollback-procedure)
5. [Incident Response](#5-incident-response)
6. [Monitoring & Alerting](#6-monitoring--alerting)
7. [Database Operations](#7-database-operations)
8. [Routine Maintenance](#8-routine-maintenance)
9. [Escalation Matrix](#9-escalation-matrix)

---

## 1. System Overview

| Component | Technology | Managed By | Dashboard |
|---|---|---|---|
| Frontend SPA | React + Vite → static build | Vercel | https://vercel.com/dashboard |
| Database | Supabase PostgreSQL | Supabase | https://app.supabase.com |
| Authentication | Supabase Auth | Supabase | Supabase dashboard |
| File storage | Supabase Storage | Supabase | Supabase dashboard |
| Edge functions | Supabase Edge (Deno) | Supabase | Supabase dashboard |
| DNS | Provider varies | Team | DNS provider dashboard |
| Error tracking | Sentry | Sentry | https://sentry.io |

### Environment URLs

| Environment | URL | Supabase Project |
|---|---|---|
| Production | `https://flashfusion.dev` | Production project |
| Staging | `https://staging.flashfusion.dev` | Staging project |
| Preview | `https://<hash>.vercel.app` | Staging project |

---

## 2. Health Checks

### Quick Status Check (< 2 minutes)

```bash
# 1. Check the production site is up
curl -sf https://flashfusion.dev > /dev/null && echo "✅ Production UP" || echo "❌ Production DOWN"

# 2. Check the login page is reachable
curl -sf https://flashfusion.dev/login > /dev/null && echo "✅ Login page OK" || echo "❌ Login page FAIL"

# 3. Check Supabase health endpoint
curl -sf "https://<project-id>.supabase.co/rest/v1/" \
  -H "apikey: <anon-key>" > /dev/null && echo "✅ Supabase API OK" || echo "❌ Supabase API FAIL"
```

### Full Health Check

| Check | Expected | Tool |
|---|---|---|
| Homepage HTTP status | `200` | `curl -I https://flashfusion.dev` |
| Login page HTTP status | `200` | `curl -I https://flashfusion.dev/login` |
| Vercel build status | Latest deployment is `Ready` | Vercel dashboard |
| Supabase database | No alarms in Supabase dashboard | Supabase → Reports |
| Sentry error rate | No spike in last 15 minutes | Sentry → Issues |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms | Vercel Analytics |

---

## 3. Deployment Procedures

### Routine Deployment (develop → staging)

Automatic via GitHub Actions on merge to `develop`. No manual steps required.

Verify:
1. CI pipeline passed (GitHub Actions tab)
2. Vercel staging deployment is `Ready`
3. Open staging URL and smoke-test login flow

### Production Deployment (main release)

1. Ensure release PR has been approved and all CI checks pass.
2. Merge the release PR to `main` (squash merge).
3. GitHub Actions automatically triggers a Vercel production deployment.
4. Monitor Vercel dashboard for build completion (usually < 3 minutes).
5. Run smoke tests:

```bash
# After deployment
./scripts/smoke-test.sh https://flashfusion.dev
```

6. Check Sentry for any new error spikes in the first 15 minutes post-deploy.
7. If issues are found, initiate [Rollback Procedure](#4-rollback-procedure).

### Manual Deployment via Vercel CLI

```bash
# Deploy to production (emergency use only)
vercel --prod
```

---

## 4. Rollback Procedure

### Option A — Vercel Instant Rollback (Preferred)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → select the FlashFusion project.
2. Click **Deployments**.
3. Find the last known-good deployment (look for the one before the current broken deployment).
4. Click **...** → **Promote to Production**.
5. Confirm the rollback in the modal.
6. Verify the production URL returns the previous version.

**Time to complete:** < 2 minutes.

### Option B — Git Rollback

```bash
# 1. Identify the last good commit SHA
git log --oneline origin/main -10

# 2. Create a rollback branch from the good commit
git checkout -b hotfix/rollback-to-<sha> <sha>

# 3. Push and open a PR to main
git push origin hotfix/rollback-to-<sha>
# Open PR in GitHub — this triggers a preview deploy for testing

# 4. After verifying on preview, merge to main
```

**Time to complete:** 10–20 minutes.

---

## 5. Incident Response

### Severity Classification

| Severity | Criteria | Target Response | Target Resolution |
|---|---|---|---|
| **P0 — Critical** | Production completely down; data loss or breach | < 15 minutes | < 2 hours |
| **P1 — High** | Major feature broken for >50% users; security vulnerability | < 1 hour | < 8 hours |
| **P2 — Medium** | Feature degraded; < 50% users affected | < 4 hours | < 24 hours |
| **P3 — Low** | Minor UX issue; cosmetic bug | Next sprint | Next sprint |

### P0 Response Procedure

1. **Alert** — page on-call engineer via PagerDuty / Slack.
2. **Assess** (5 min) — confirm the issue and determine blast radius.
   - Is the site completely down?
   - Is authentication broken?
   - Is there a data breach?
3. **Contain** (10 min) — if code-related, initiate [Rollback](#4-rollback-procedure).
4. **Communicate** (15 min) — post status update to `#incidents` Slack channel:
   ```
   🔴 INCIDENT — [P0] Production site unreachable
   Time detected: HH:MM UTC
   Impact: All users cannot access the application
   Status: Investigating / Rolling back
   Next update: in 30 minutes
   ```
5. **Remediate** — fix the root cause and redeploy.
6. **Resolve** — confirm the fix works on production.
7. **Post-mortem** — within 48 hours, document in `docs/post-mortems/<date>-<incident-title>.md`:
   - Timeline
   - Root cause
   - Impact
   - Resolution
   - Prevention measures

---

## 6. Monitoring & Alerting

### Dashboards

| Dashboard | URL | Use For |
|---|---|---|
| Vercel Analytics | Vercel Dashboard → Analytics | Web vitals, traffic, deployment status |
| Supabase Reports | Supabase Dashboard → Reports | DB performance, API latency, storage |
| Sentry | sentry.io | Runtime errors, crash rates |

### Alert Thresholds (Recommended)

Configure alerts in Sentry and Vercel:

| Metric | Warning | Critical |
|---|---|---|
| Error rate | > 1% of requests | > 5% of requests |
| P95 response time | > 1s | > 3s |
| LCP (Largest Contentful Paint) | > 2.5s | > 4s |
| New error type | Any | — |

### Log Access

```bash
# Vercel deployment logs
vercel logs https://flashfusion.dev

# Supabase edge function logs
# Available in Supabase Dashboard → Edge Functions → [function] → Logs

# Real-time log streaming (Vercel CLI)
vercel logs --follow
```

---

## 7. Database Operations

### Creating a Backup

Supabase takes automatic daily backups (Pro plan: 7-day retention; Free plan: no PITR).

To manually export a backup:

```bash
# Via Supabase CLI
supabase db dump -f backup-$(date +%Y%m%d).sql --project-ref <project-ref>
```

### Applying a Migration

```bash
# 1. Write migration file
# supabase/migrations/<timestamp>_<description>.sql

# 2. Test on local / staging
supabase db push --project-ref <staging-project-ref>

# 3. Apply to production (with maintenance window if schema changes are breaking)
supabase db push --project-ref <prod-project-ref>
```

### Checking Database Performance

In Supabase Dashboard → **Reports** → **Query Performance**:
- Look for slow queries (> 100ms P95)
- Check for missing indexes on frequently filtered columns

---

## 8. Routine Maintenance

### Weekly
- [ ] Review Sentry error trends for new or escalating issues
- [ ] Check Vercel Analytics for Web Vitals regressions
- [ ] Review `npm audit` output for new vulnerabilities

### Monthly
- [ ] Rotate Vercel deploy token (update GitHub Actions secret)
- [ ] Review Supabase Storage usage and clean up stale uploads
- [ ] Review and update RLS policies if new tables were added
- [ ] Test the rollback procedure in staging

### Quarterly
- [ ] Full documentation review — ensure all docs match current behaviour
- [ ] Dependency audit and upgrade pass (`npm outdated`, `npm audit`)
- [ ] Review feature flag status — remove flags for fully-shipped features
- [ ] Incident post-mortem review — identify systemic issues

---

## 9. Escalation Matrix

| Role | Responsibility | Contact |
|---|---|---|
| **On-call Engineer** | First responder, initial triage | PagerDuty / Slack `@on-call` |
| **Engineering Lead** | P0/P1 escalation, architectural decisions | _[Fill in contact]_ |
| **DevOps** | Infrastructure, Vercel, Supabase issues | _[Fill in contact]_ |
| **Product Owner** | Business impact assessment, user comms | _[Fill in contact]_ |
| **Security Lead** | Data breach, security incident | _[Fill in contact]_ |

### External Support

| Service | Support Channel |
|---|---|
| Supabase | https://supabase.com/support |
| Vercel | https://vercel.com/support |
| Sentry | https://sentry.io/support |

---

*Last Updated: 2026-03-08 | Owner: DevOps / Engineering Lead*
