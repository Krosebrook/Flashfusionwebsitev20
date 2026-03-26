# INT Engineering — PR Governance Policy v1.0

**Owner:** Platform Engineering & AppSec  
**Effective Date:** 2026-03-26  
**Status:** Active  

---

## Table of Contents

1. [Purpose](#purpose)
2. [Scope](#scope)
3. [Branch Protection Rules](#branch-protection-rules)
4. [CODEOWNERS Guidance](#codeowners-guidance)
5. [Merge Requirements](#merge-requirements)
6. [PR Hygiene Standards](#pr-hygiene-standards)
7. [Security Review Process](#security-review-process)
8. [Automation](#automation)
9. [Rollout Plan](#rollout-plan)
10. [Enforcement & Exceptions](#enforcement--exceptions)

---

## Purpose

This policy establishes engineering standards for pull request governance across all INT-owned repositories. It ensures that code changes are reviewed, tested, and secure before merging into protected branches.

---

## Scope

This policy applies to:

- All engineers contributing to INT-owned GitHub repositories
- All PRs targeting `main`, `release/*`, or `hotfix/*` branches
- Automated CI/CD workflows operating on behalf of engineers

---

## Branch Protection Rules

The following rules must be configured on `main` (and any `release/*` / `hotfix/*` branches) via repository settings or the `gh` CLI:

| Rule | Setting |
|------|---------|
| Required approving reviews | **1 minimum** (2 for `release/*` branches) |
| Dismiss stale reviews on new commits | **Enabled** |
| Require review from Code Owners | **Enabled** |
| Restrict who can push | Repository admins + release engineers only |
| Enforce rules for administrators | **Enabled** |
| Allow force pushes | **Disabled** |
| Allow deletions | **Disabled** |
| Require status checks to pass before merging | **Enabled** |
| Required status checks | `CI / Build & Test`, `lint`, `unit-tests`, `security-scan` |
| Require branches to be up to date before merging | **Enabled** |
| Require linear history | **Enabled** (squash merges only on feature branches) |
| Require signed commits | Recommended; mandatory for `release/*` |

### Applying Branch Protection via `gh` CLI

Run the following command **after reviewing it** to apply the rules above to `main`:

```sh
gh api repos/Krosebrook/Flashfusionwebsitev20/branches/main/protection \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  --field "required_status_checks[strict]=true" \
  --field "required_status_checks[contexts][]=CI / Build & Test" \
  --field "required_status_checks[contexts][]=lint" \
  --field "required_status_checks[contexts][]=unit-tests" \
  --field "required_status_checks[contexts][]=security-scan" \
  --field "enforce_admins=true" \
  --field "required_pull_request_reviews[dismiss_stale_reviews]=true" \
  --field "required_pull_request_reviews[require_code_owner_reviews]=true" \
  --field "required_pull_request_reviews[required_approving_review_count]=1" \
  --field "restrictions=null" \
  --field "allow_force_pushes=false" \
  --field "allow_deletions=false"
```

> **Note:** Run this command manually after reviewing the settings. Do not automate this step without change-management approval.

---

## CODEOWNERS Guidance

A `CODEOWNERS` file must be maintained at `.github/CODEOWNERS` or `CODEOWNERS` in the repository root.

### Minimum Required Entries

```
# Global fallback — all files require review from core team
*                          @Krosebrook/core-team

# Security-sensitive paths — require AppSec review
src/auth/                  @Krosebrook/appsec
infra/                     @Krosebrook/platform @Krosebrook/appsec
secrets/                   @Krosebrook/appsec
middleware/                @Krosebrook/appsec
terraform/                 @Krosebrook/platform
helm/                      @Krosebrook/platform
.env*                      @Krosebrook/appsec

# CI/CD workflows — require Platform review
.github/workflows/         @Krosebrook/platform

# Documentation
docs/                      @Krosebrook/core-team
.github/docs/              @Krosebrook/core-team
```

### Rules

- Every PR must have at least one CODEOWNERS review approval before merge.
- Security-sensitive paths require explicit AppSec team approval.
- CODEOWNERS entries should be kept up to date as team membership changes.
- Avoid using individual GitHub handles in CODEOWNERS; use team slugs instead for resilience.

---

## Merge Requirements

### Feature Branches → `main`

| Requirement | Value |
|-------------|-------|
| Merge strategy | **Squash and merge** |
| Commit message format | `<type>(<scope>): <description>` (Conventional Commits) |
| PR title | Must match commit message format |
| Linked issue | Required (use `Closes #<n>` in PR body) |
| Required approvals | 1 (CODEOWNERS rule applies) |
| CI must pass | Yes (all required status checks) |
| Branch up to date | Yes |

### `release/*` Branches → `main`

| Requirement | Value |
|-------------|-------|
| Merge strategy | **Merge commit** (preserves release history) |
| Required approvals | 2 |
| Security review | Mandatory if any security-sensitive paths changed |
| Signed commits | Required |

### `hotfix/*` Branches → `main`

| Requirement | Value |
|-------------|-------|
| Merge strategy | **Squash and merge** |
| Required approvals | 1 (expedited; notify #eng-oncall) |
| Post-merge | Back-merge hotfix into active `release/*` branch within 24 hours |

### Prohibited Merge Strategies

- **Direct pushes to `main`** are prohibited for all engineers including admins.
- **Force pushes** to any protected branch are prohibited.
- **Merge commits from feature branches** are discouraged; use squash merge to keep history clean.

---

## PR Hygiene Standards

### PR Size

| Lines Changed | Classification | Action Required |
|---------------|----------------|-----------------|
| 0–400 | Small | Standard review |
| 401–800 | Medium | Standard review; consider splitting |
| 801+ | Large | **Automated warning posted**; strong recommendation to split |

PRs over 800 lines will receive an automated comment from the PR Governance bot. Engineers are strongly encouraged to split large PRs into focused, independently reviewable changes.

### PR Lifetime

- PRs should not remain open longer than **5 business days** without activity.
- Stale PRs (no activity for 7 days) may be closed by a maintainer with a "stale" label.
- Authors are responsible for keeping their PR branch up to date with `main`.

### PR Description Quality

Every PR must include:

- **Summary**: What the PR does and why (1–3 sentences)
- **Type of Change**: At least one type checkbox checked
- **What Changed**: Files/systems affected and rationale
- **Testing**: How the change was tested
- **Security Impact**: Explicit acknowledgement of security implications (or N/A)
- **Rollback Plan**: How to revert if something goes wrong

Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) for every PR.

### Draft PRs

- Use draft PRs for work-in-progress changes.
- Do not request reviews on draft PRs.
- Convert to "Ready for Review" only when all checklist items are complete.

---

## Security Review Process

### Trigger Paths

The `pr-governance` workflow automatically applies the `security-review` label when a PR modifies:

- `src/auth/`
- `infra/`
- `secrets/`
- `middleware/`
- `.env` / `.env.*`
- `terraform/`
- `helm/`

### Manual Trigger

Any team member may trigger a security review by adding the comment `@security-review` to a PR description or comment. The AppSec team will be notified.

### CI Enforcement

CI will **fail** on PRs that touch security-sensitive paths but are missing the `security-review` label. The label is applied automatically; if it is absent, apply it manually and ensure AppSec review is completed before merging.

### Security Review SLA

| Severity | Review SLA |
|----------|-----------|
| Critical path (auth, secrets) | 1 business day |
| Infrastructure changes | 2 business days |
| Other security-tagged PRs | 3 business days |

---

## Automation

The `.github/workflows/pr-governance.yml` workflow provides the following automation:

| Job | Trigger | Action |
|-----|---------|--------|
| `security-label` | PR opened/updated | Applies `security-review` label if sensitive paths changed |
| `enforce-security-review` | PR opened/updated | Fails CI if sensitive paths changed but label is missing |
| `pr-size-warning` | PR opened/updated | Posts a warning comment if PR exceeds 800 lines |

All automation runs in the context of the `GITHUB_TOKEN` with minimal required permissions (`pull-requests: write`, `issues: write`, `contents: read`).

---

## Rollout Plan

### Phase 1 — Foundation (Week 1–2)

- [x] Deploy PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
- [x] Deploy `pr-governance.yml` workflow
- [x] Publish this policy document
- [ ] Create `CODEOWNERS` file with team entries
- [ ] Create GitHub teams: `core-team`, `platform`, `appsec`

### Phase 2 — Branch Protection (Week 3)

- [ ] Apply branch protection rules to `main` using the `gh` CLI command in this document
- [ ] Enable required status checks (`CI / Build & Test`, `lint`, `unit-tests`, `security-scan`)
- [ ] Verify all required CI jobs are reporting status correctly
- [ ] Communicate policy to all engineers

### Phase 3 — Hardening (Week 4+)

- [ ] Enable signed commits for `release/*` branches
- [ ] Add `security-scan` CI job (e.g., CodeQL or Semgrep)
- [ ] Integrate with Slack: post PR governance alerts to `#eng-pr-alerts`
- [ ] Quarterly review of CODEOWNERS and team membership
- [ ] Retrospective on policy effectiveness at 30-day mark

---

## Enforcement & Exceptions

### Enforcement

Violations of this policy (e.g., bypassing required reviews, disabling CI) must be documented in an incident report and reviewed by the Engineering Lead and AppSec within 5 business days.

### Exceptions Process

To request a temporary exception to any rule in this policy:

1. Open an issue in this repository with the label `governance-exception`
2. Describe the business justification and the specific rule being excepted
3. Obtain approval from at least one Engineering Lead and one AppSec team member
4. Set an expiry date for the exception (maximum 30 days)

### Questions & Feedback

Open a GitHub Discussion or contact the Platform Engineering team in `#platform-eng`.
