# Versioning & Release Policy

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** All team members

---

## Table of Contents

1. [Semantic Versioning](#1-semantic-versioning)
2. [Branching Strategy](#2-branching-strategy)
3. [Release Process](#3-release-process)
4. [Hotfix Process](#4-hotfix-process)
5. [Pre-release Versions](#5-pre-release-versions)
6. [Deprecation Policy](#6-deprecation-policy)
7. [Changelog Maintenance](#7-changelog-maintenance)

---

## 1. Semantic Versioning

FlashFusion follows [Semantic Versioning 2.0.0](https://semver.org): `MAJOR.MINOR.PATCH`.

| Increment | When to use | Example trigger |
|---|---|---|
| **MAJOR** (`X.0.0`) | Breaking changes to the public interface or major platform shifts | Removing a feature, changing the auth flow entirely, Next.js migration |
| **MINOR** (`x.Y.0`) | New backwards-compatible features | New AI tool added, new dashboard section |
| **PATCH** (`x.y.Z`) | Backwards-compatible bug fixes | Fixing a broken form, correcting a visual glitch |

### Version Bump Rules

- The version in `package.json` is the authoritative version.
- Version is bumped **in the release PR**, not in individual feature PRs.
- All changes since the last release are collected into the bump.

---

## 2. Branching Strategy

```
main ─────────────────────────────────────────────────► (production)
  ▲                                                         │
  │ merge                                                   │
develop ──────────────────────────────────────────────►    │
  ▲       ▲         ▲                                       │
  │       │         │                                       │
feature/* fix/*   chore/*                            hotfix/*
```

| Branch | Purpose | Base Branch | Merges Into |
|---|---|---|---|
| `main` | Production code | — | — |
| `develop` | Integration branch | `main` | `main` (via release PR) |
| `feature/<name>` | New features | `develop` | `develop` |
| `fix/<name>` | Bug fixes | `develop` | `develop` |
| `chore/<name>` | Non-functional changes | `develop` | `develop` |
| `docs/<name>` | Documentation only | `develop` | `develop` |
| `hotfix/<name>` | Critical production fixes | `main` | `main` and `develop` |
| `release/<version>` | Release preparation | `develop` | `main` and `develop` |

### Branch Protection Rules

| Branch | Rules |
|---|---|
| `main` | Requires PR, 1 approval, all CI checks pass, no direct push |
| `develop` | Requires PR, 1 approval, build check passes |

---

## 3. Release Process

### Step 1 — Create Release Branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/2.2.0
```

### Step 2 — Bump Version

```bash
# Update package.json version
npm version minor --no-git-tag-version   # or major / patch
```

### Step 3 — Update Changelog

Edit `docs/10-changelog.md`:

```markdown
## [2.2.0] - 2026-05-01

### Added
- New AI tool gallery with 10 additional tools
- Collaborative workspace feature

### Changed
- Improved mobile navigation UX

### Fixed
- Dashboard chart data not refreshing after filter change
```

### Step 4 — Open Release PR

- PR from `release/2.2.0` → `main`
- Title: `chore(release): 2.2.0`
- Include changelog summary in PR description
- Tag at least 2 reviewers

### Step 5 — Merge and Tag

After PR approval and CI green:

```bash
# Merge the release PR (squash merge to main)
# Then tag the merge commit
git tag -a v2.2.0 -m "Release v2.2.0"
git push origin v2.2.0
```

### Step 6 — Back-merge to Develop

```bash
git checkout develop
git merge main
git push origin develop
```

### Step 7 — Publish Release Notes

1. In GitHub: **Releases → Draft a new release**
2. Choose tag `v2.2.0`
3. Paste the changelog section
4. Publish release

---

## 4. Hotfix Process

Use when a critical production issue must be fixed without waiting for the next planned release.

```bash
# Branch from main (not develop)
git checkout main
git pull origin main
git checkout -b hotfix/fix-auth-crash

# ... make the fix ...

# Open PR: hotfix/fix-auth-crash → main
# After merge, also merge into develop:
git checkout develop
git merge main
git push origin develop
```

Bump a PATCH version (`2.1.0` → `2.1.1`) and follow steps 3–7 of the release process.

---

## 5. Pre-release Versions

| Suffix | Meaning | Example |
|---|---|---|
| `-alpha.N` | Very early, unstable, internal only | `2.2.0-alpha.1` |
| `-beta.N` | Feature-complete, external testing | `2.2.0-beta.1` |
| `-rc.N` | Release candidate, final testing | `2.2.0-rc.1` |

Pre-release builds deploy to the **staging** environment only.

---

## 6. Deprecation Policy

1. Announce deprecation in the changelog under a `### Deprecated` section.
2. Keep the deprecated API/feature functional for at least **one MINOR release** after deprecation.
3. Remove in the next MAJOR release.
4. Add a runtime warning in development builds for deprecated code paths.

---

## 7. Changelog Maintenance

- Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
- Sections per release: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Each entry links to the relevant PR or issue.
- Unreleased changes accumulate under the `[Unreleased]` heading.

See [Changelog](./10-changelog.md) for the current history.

---

*Last Updated: 2026-03-08 | Owner: Engineering / Product Owner*
