# Documentation Update Plan & Validation Strategy

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Engineering Lead, Product Owner, DevOps

---

## Table of Contents

1. [Phased Update Plan](#1-phased-update-plan)
2. [Validation Strategy](#2-validation-strategy)
3. [Maintenance Cadence](#3-maintenance-cadence)
4. [Documentation Health Metrics](#4-documentation-health-metrics)

---

## 1. Phased Update Plan

### Phase 0 — Foundation (Completed: 2026-03-08)

**Goal:** Establish a canonical `docs/` directory with all required documents.

| Task | Owner | Status | Effort |
|---|---|---|---|
| Create `docs/` directory structure | Developer | ✅ Done | 1h |
| Update root `README.md` | Developer | ✅ Done | 0.5h |
| Write Architecture Overview | Developer | ✅ Done | 2h |
| Write Installation & Deployment Guide | Developer/DevOps | ✅ Done | 2h |
| Write Developer Guide | Developer | ✅ Done | 3h |
| Write Configuration Guide | Developer | ✅ Done | 1.5h |
| Write Versioning & Release Policy | Engineering Lead | ✅ Done | 1h |
| Write CI/CD Pipeline Documentation | DevOps | ✅ Done | 2h |
| Write Testing Guide | Developer/QA | ✅ Done | 2h |
| Write Security Guide | Developer | ✅ Done | 2.5h |
| Write Troubleshooting Guide | Developer/QA | ✅ Done | 1.5h |
| Write Changelog | Engineering Lead | ✅ Done | 1h |
| Write API Reference | Developer | ✅ Done | 2h |
| Write Onboarding Checklist | Engineering Lead | ✅ Done | 1h |
| Write Operational Runbook | DevOps | ✅ Done | 2h |
| Write Standards & Conventions | Engineering Lead | ✅ Done | 2h |
| Write Gap Analysis | Engineering Lead | ✅ Done | 1h |
| Create PR and issue templates | Developer | ✅ Done | 0.5h |
| Write all sample templates | Developer | ✅ Done | 1.5h |

---

### Phase 1 — Infrastructure & CI (Weeks 1–2)

**Goal:** Wire up the CI/CD pipeline and create missing infrastructure files.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 1.1 | Create `.env.example` file | Developer | Phase 0 | 30 min | Critical |
| 1.2 | Create `.github/workflows/ci.yml` | DevOps | Phase 0 | 2h | Critical |
| 1.3 | Create `.github/workflows/deploy.yml` | DevOps | 1.2 | 1h | High |
| 1.4 | Create `.github/workflows/release.yml` | DevOps | 1.3 | 30 min | High |
| 1.5 | Create `vercel.json` with SPA rewrites + CSP headers | DevOps | Phase 0 | 1h | High |
| 1.6 | Set up GitHub branch protection rules (`main`, `develop`) | Engineering Lead | 1.2 | 30 min | High |
| 1.7 | Configure Vercel project with environment variables | DevOps | 1.3 | 1h | High |
| 1.8 | Set up Sentry error monitoring project | DevOps | Phase 0 | 1h | Medium |

**Milestone:** CI pipeline runs on every PR, deployment is automated.

---

### Phase 2 — Testing Infrastructure (Weeks 2–3)

**Goal:** Establish a working test suite with baseline coverage.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 2.1 | Add `vitest.config.ts` and `src/test/setup.ts` | Developer | 1.2 | 1h | Critical |
| 2.2 | Write unit tests for all utilities in `src/lib/` | Developer | 2.1 | 4h | High |
| 2.3 | Write component tests for all `src/components/ui/` primitives | QA | 2.1 | 8h | High |
| 2.4 | Write integration tests for auth flows | Developer | 2.1 | 4h | High |
| 2.5 | Achieve 70% statement coverage | Developer/QA | 2.2–2.4 | ongoing | High |
| 2.6 | Add coverage gate to CI pipeline | DevOps | 2.1 | 30 min | High |
| 2.7 | Evaluate Playwright for E2E tests | QA | 2.3 | 2h | Medium |

**Milestone:** `npm test` runs with ≥ 70% coverage; coverage gate enforced in CI.

---

### Phase 3 — Developer Experience (Weeks 3–4)

**Goal:** Improve onboarding speed and day-to-day development workflow.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 3.1 | Create `supabase/migrations/` with initial schema | Developer | Phase 0 | 4h | High |
| 3.2 | Generate TypeScript types from Supabase schema | Developer | 3.1 | 1h | High |
| 3.3 | Set up ESLint config with React + TypeScript rules | Developer | Phase 0 | 1h | High |
| 3.4 | Set up Prettier config with team preferences | Developer | 3.3 | 30 min | Medium |
| 3.5 | Add `scripts` to `package.json`: `lint`, `type-check`, `test:watch`, `test:coverage` | Developer | 3.3 | 30 min | High |
| 3.6 | Add VS Code recommended extensions file (`.vscode/extensions.json`) | Developer | Phase 0 | 30 min | Medium |
| 3.7 | Conduct first developer onboarding using checklist; gather feedback | Engineering Lead | 3.1–3.6 | 2h | High |

**Milestone:** A new developer can be productive within one working day.

---

### Phase 4 — Security & Compliance (Weeks 4–5)

**Goal:** Implement security controls documented in the security guide.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 4.1 | Audit all Supabase tables — confirm RLS is enabled | Developer | 3.1 | 2h | Critical |
| 4.2 | Run `npm audit` and resolve all high/critical CVEs | Developer | Phase 0 | 2h | Critical |
| 4.3 | Implement `vercel.json` security headers (CSP, X-Frame-Options) | DevOps | 1.5 | 1h | High |
| 4.4 | Set up gitleaks pre-commit hook | DevOps | Phase 0 | 30 min | High |
| 4.5 | Verify no `service_role` key referenced in client code | Developer | Phase 0 | 1h | Critical |
| 4.6 | Review and document data retention policy | Product/Legal | Phase 0 | 2h | Medium |
| 4.7 | Add `npm audit` step to CI pipeline | DevOps | 1.2 | 30 min | High |

**Milestone:** Security baseline met; no high/critical vulnerabilities; RLS on all tables.

---

### Phase 5 — Documentation Quality & Validation (Weeks 5–6)

**Goal:** Validate documentation accuracy and establish maintenance processes.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 5.1 | Peer review all 13 core docs — verify accuracy | Developer + DevOps | Phase 0 | 4h | High |
| 5.2 | New developer shadow session — follow onboarding checklist | Engineering Lead | 3.7 | 2h | High |
| 5.3 | Add markdown-link-check to CI | DevOps | 1.2 | 30 min | Medium |
| 5.4 | Archive or consolidate docs in `src/` directory | Engineering Lead | Phase 0 | 2h | Medium |
| 5.5 | Update `src/docs/README.md` to redirect to `docs/` | Developer | 5.4 | 30 min | Low |
| 5.6 | Document Sentry alert thresholds | DevOps | 1.8 | 1h | Medium |
| 5.7 | Establish documentation review calendar (quarterly) | Engineering Lead | Phase 0 | 30 min | Low |

**Milestone:** All docs peer-reviewed; broken links fixed; maintenance calendar established.

---

### Phase 6 — Advanced Features (Weeks 6–8)

**Goal:** Complete higher-effort improvements.

| # | Task | Owner | Dependency | Effort | Priority |
|---|---|---|---|---|---|
| 6.1 | Implement Playwright E2E suite (critical user flows) | QA | 2.7 | 8h | Medium |
| 6.2 | Add Storybook for UI component documentation | Developer | 3.3 | 8h | Low |
| 6.3 | Create user-facing help centre / knowledge base | Product | Phase 0 | 16h+ | Medium |
| 6.4 | Document Supabase Edge Functions (per-function API docs) | Developer | 5.1 | 4h | Medium |
| 6.5 | Evaluate Next.js migration impact on architecture docs | Engineering Lead | Phase 0 | 2h | Low |
| 6.6 | Conduct post-implementation retrospective on docs quality | All | 5.7 | 1h | Low |

---

## 2. Validation Strategy

### Peer Review Checklist (for each document)

- [ ] Technical accuracy — a developer has verified all code examples work
- [ ] Completeness — all required sections are present and populated
- [ ] Clarity — content is understandable by the target audience
- [ ] Links — all internal and external links resolve correctly
- [ ] Examples — code examples are syntactically valid and representative
- [ ] Last Updated date is correct
- [ ] No references to non-existent files

### Automated Validation (in CI)

```yaml
# .github/workflows/docs-check.yml (Phase 5 task)
name: Docs Check
on: [pull_request]
jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check links
        uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          folder-path: 'docs/'
          config-file: '.mlc-config.json'
```

### User Review (Onboarding)

Each new developer should:
1. Follow the [Onboarding Checklist](./12-onboarding.md) without assistance.
2. Record any step that was unclear or failed.
3. Submit feedback as a GitHub Issue with the `documentation` label.

---

## 3. Maintenance Cadence

### Triggered Updates (on code change)

| Trigger | Documents to Update |
|---|---|
| New environment variable added | `docs/04-configuration.md` |
| API endpoint changed | `docs/11-api-reference.md` |
| New Supabase table created | `docs/08-security.md` (RLS section), `docs/11-api-reference.md` |
| New deployment target added | `docs/02-installation-deployment.md`, `docs/06-cicd-pipeline.md` |
| Security policy changed | `docs/08-security.md` |
| New developer tool/script added | `docs/03-developer-guide.md`, `docs/12-onboarding.md` |
| Release shipped | `docs/10-changelog.md`, `docs/05-versioning-release.md` |
| Breaking change | `docs/10-changelog.md` (Upgrade Notes section) |

**Rule:** The PR that makes a code change must also update any affected documentation. Documentation updates are part of the Definition of Done.

### Scheduled Reviews

| Frequency | Activity | Owner |
|---|---|---|
| On every PR | Author self-check against standards | Developer |
| Weekly | Review Sentry/analytics — update troubleshooting if new issues | On-call |
| Monthly | Review outdated flags in all docs | Engineering Lead |
| Quarterly | Full documentation audit — peer review all 13 core docs | Engineering Lead |
| On major release | Update architecture, changelog, onboarding | Engineering Lead |

---

## 4. Documentation Health Metrics

| Metric | Target | Current | Measurement |
|---|---|---|---|
| Required docs present | 100% (13/13) | ✅ 100% | Manual count |
| Docs updated in last 6 months | ≥ 80% | ✅ 100% (just created) | Check `Last Updated` |
| Broken internal links | 0 | TBD | `markdown-link-check` |
| PR template completion rate | ≥ 90% | TBD | GitHub metrics |
| New dev → first PR (days) | ≤ 5 | TBD | Onboarding survey |
| Post-incident P0 MTTR | ≤ 2 hours | TBD | Incident log |
| Documentation satisfaction score | ≥ 4/5 | TBD | Developer survey |
| Test coverage | ≥ 70% | TBD | Vitest coverage |

---

*Last Updated: 2026-03-08 | Owner: Engineering Lead / Product Owner*
