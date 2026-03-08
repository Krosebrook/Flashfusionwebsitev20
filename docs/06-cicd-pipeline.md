# CI/CD Pipeline Documentation

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** DevOps, Developers

---

## Table of Contents

1. [Pipeline Overview](#1-pipeline-overview)
2. [GitHub Actions Workflows](#2-github-actions-workflows)
3. [Environment-Specific Pipelines](#3-environment-specific-pipelines)
4. [Secrets Management](#4-secrets-management)
5. [Quality Gates](#5-quality-gates)
6. [Deployment Automation](#6-deployment-automation)
7. [Monitoring & Notifications](#7-monitoring--notifications)
8. [Extending the Pipeline](#8-extending-the-pipeline)

---

## 1. Pipeline Overview

```
Developer pushes code
       │
       ▼
[PR opened / updated]
       │
       ├── Lint check (ESLint / TypeScript)
       ├── Unit tests (Vitest)
       ├── Build check (Vite)
       └── Security audit (npm audit)
               │
           All pass?
               │
          ┌───┴───┐
         Yes      No → Block merge, notify developer
          │
     [Merge to develop]
          │
          ├── Build & deploy to Staging (Vercel)
          └── Integration smoke test
                  │
          [Merge to main (release PR)]
                  │
          Deploy to Production (Vercel)
                  │
          Post-deploy smoke test
```

---

## 2. GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Triggers: `push` to any branch, `pull_request` to `develop` or `main`.

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [develop, main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint          # ESLint
      - run: npm run type-check    # tsc --noEmit

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=high
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

Triggers: push to `develop` (staging), push to `main` (production).

```yaml
name: Deploy

on:
  push:
    branches: [develop, main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_APP_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### Release Workflow (`.github/workflows/release.yml`)

Triggers: push of a tag matching `v*.*.*`.

```yaml
name: Release

on:
  push:
    tags: ['v*.*.*']

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
          token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 3. Environment-Specific Pipelines

| Environment | Trigger | Vercel Target | Supabase Project |
|---|---|---|---|
| Preview (per-PR) | PR opened/updated | Preview deployment | Staging |
| Staging | Merge to `develop` | Preview (stable URL) | Staging |
| Production | Merge to `main` | Production | Production |

Vercel automatically creates preview deployments for every PR when the repository is connected. No additional workflow configuration is needed for previews.

---

## 4. Secrets Management

### GitHub Repository Secrets

Configure in **GitHub → Repository → Settings → Secrets and variables → Actions**.

| Secret | Description | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | All |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | All |
| `VERCEL_TOKEN` | Vercel deploy token | All |
| `VERCEL_ORG_ID` | Vercel organisation ID | All |
| `VERCEL_PROJECT_ID` | Vercel project ID | All |
| `VITE_SENTRY_DSN` | Sentry DSN | Staging, Production |

### Rules

- Never log secrets in CI output; GitHub Actions automatically masks them.
- Rotate Vercel and Supabase tokens every 90 days.
- Use **environment-scoped** secrets for production vs. staging values.
- AI API keys (`VITE_OPENAI_API_KEY`, etc.) must only be set for environments that actually use them.

---

## 5. Quality Gates

A PR cannot be merged unless all of the following gates pass:

| Gate | Tool | Failure Action |
|---|---|---|
| TypeScript strict check | `tsc --noEmit` | Block merge |
| Lint | ESLint | Block merge |
| Unit tests | Vitest | Block merge |
| Build succeeds | Vite build | Block merge |
| Security audit | `npm audit --audit-level=high` | Block merge |
| Required reviewers | GitHub branch protection | Block merge |

### Coverage Targets

| Metric | Target |
|---|---|
| Statement coverage | ≥ 70% |
| Branch coverage | ≥ 60% |
| Function coverage | ≥ 70% |

Coverage reports are uploaded as CI artefacts and surfaced in PR comments.

---

## 6. Deployment Automation

### Zero-downtime Deployments

Vercel deployments are atomic and instant. Each deployment is a separate build; traffic is only routed to the new build after a successful health check.

### Automated Smoke Tests

After each production deployment, a lightweight smoke test script verifies:

1. The homepage loads (HTTP 200)
2. The login page loads (HTTP 200)
3. The Supabase health endpoint responds

```bash
# .github/scripts/smoke-test.sh
#!/bin/bash
set -e
URL=${1:-https://flashfusion.dev}
echo "Running smoke tests against $URL"
curl -sf "$URL" > /dev/null && echo "✅ Homepage OK"
curl -sf "$URL/login" > /dev/null && echo "✅ Login page OK"
```

---

## 7. Monitoring & Notifications

| Tool | Purpose | Trigger |
|---|---|---|
| Sentry | Exception tracking | Automatic on error |
| Vercel Analytics | Web vitals, latency | Continuous |
| GitHub Actions notifications | CI failures | On failure |

Configure Slack or email notifications in GitHub Actions using the `slack-notifier` or `actions/send-email` community actions.

---

## 8. Extending the Pipeline

### Adding a New Workflow Step

1. Create or edit a YAML file in `.github/workflows/`.
2. Add the step to the appropriate `jobs` section.
3. Test by triggering on a feature branch first.

### Adding a New Environment Variable to CI

1. Add the secret to **GitHub → Settings → Secrets**.
2. Reference it in the workflow YAML: `${{ secrets.MY_NEW_SECRET }}`.
3. Add it to `docs/04-configuration.md` variable reference.

---

*Last Updated: 2026-03-08 | Owner: DevOps*
