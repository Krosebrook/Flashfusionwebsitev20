# Standards & Conventions

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** All Developers

This document provides the canonical reference for all coding and documentation standards used in FlashFusion.

---

## Table of Contents

1. [Naming Conventions](#1-naming-conventions)
2. [Folder Structure](#2-folder-structure)
3. [TypeScript Standards](#3-typescript-standards)
4. [React Component Standards](#4-react-component-standards)
5. [CSS & Tailwind Standards](#5-css--tailwind-standards)
6. [Supabase & Database Standards](#6-supabase--database-standards)
7. [Testing Standards](#7-testing-standards)
8. [Documentation Standards](#8-documentation-standards)
9. [Branching & Commit Standards](#9-branching--commit-standards)
10. [Code Review Checklist](#10-code-review-checklist)
11. [Security Standards](#11-security-standards)
12. [Logging Standards](#12-logging-standards)

---

## 1. Naming Conventions

| Element | Convention | Example | Rationale |
|---|---|---|---|
| React components | `PascalCase` | `UserProfileCard` | Consistent with JSX convention |
| Component files | `PascalCase.tsx` | `UserProfileCard.tsx` | Mirrors component name |
| Hook files | `camelCase.ts` | `useAuthSession.ts` | Consistent with hook naming |
| Utility files | `kebab-case.ts` | `format-date.ts` | Filesystem-safe |
| Style files | `kebab-case.css` | `global-tokens.css` | Filesystem-safe |
| Directories | `kebab-case/` | `user-profile/` | Filesystem cross-platform |
| Variables | `camelCase` | `currentUserId` | JS convention |
| Functions | `camelCase` | `formatDate()` | JS convention |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE` | Distinguishes from variables |
| Boolean variables | `is`, `has`, `should` prefix | `isLoading`, `hasError` | Self-documenting |
| Event handlers (props) | `on` prefix | `onSubmit`, `onClose` | React convention |
| Event handlers (impl) | `handle` prefix | `handleSubmit` | Distinguishes from prop name |
| TypeScript interfaces | `PascalCase` (no `I` prefix) | `UserProfile` | Modern TS style |
| TypeScript types | `PascalCase` | `AuthState` | Consistent with interfaces |
| CSS variables | `--flashfusion-<token>` | `--flashfusion-primary` | Namespaced for brand |
| Supabase tables | `snake_case` | `user_projects` | PostgreSQL convention |
| Supabase columns | `snake_case` | `created_at` | PostgreSQL convention |
| Test files | `ComponentName.test.tsx` | `Button.test.tsx` | Standard jest/vitest pattern |

---

## 2. Folder Structure

```
src/
├── components/
│   ├── core/           # App shell, routing, initialisation, performance
│   ├── layout/         # Persistent chrome: header, footer, navigation
│   ├── pages/          # One component per route; named after route
│   ├── ui/             # Shared primitives (shadcn/ui wrappers)
│   ├── providers/      # React context providers
│   ├── hooks/          # Shared custom hooks used across features
│   ├── <feature>/      # Feature-scoped components (e.g., automation/, testing/)
│   ├── debug/          # Development-only diagnostic components
│   └── integrations/   # Third-party integration UIs
├── lib/                # Framework-agnostic utilities (no React imports)
├── styles/             # Global CSS, Tailwind config, design tokens
├── test/               # Global test setup and shared test utilities
└── main.tsx            # Application entry point
```

### Placement Rules

| Code Type | Location |
|---|---|
| New route page | `src/components/pages/NewFeaturePage.tsx` |
| Feature-specific component | `src/components/<feature>/ComponentName.tsx` |
| Shared UI primitive | `src/components/ui/component-name.tsx` |
| Custom hook used in one feature | Co-located: `src/components/<feature>/useHookName.ts` |
| Custom hook used across features | `src/hooks/useHookName.ts` |
| Pure utility function | `src/lib/utility-name.ts` |
| Type definitions | Co-located with their module OR `src/lib/types.ts` for shared types |

---

## 3. TypeScript Standards

| Rule | Required | Rationale |
|---|---|---|
| `"strict": true` in tsconfig | ✅ | Catches null/undefined errors at compile time |
| No `any` type | ✅ | Defeats the purpose of TypeScript |
| No `ts-ignore` without comment | ✅ | Requires justification for suppressions |
| No `as any` casting | ✅ | Use proper type narrowing |
| Explicit return types on non-trivial functions | Recommended | Improves readability and catches bugs |
| `unknown` instead of `any` for untyped data | ✅ | Forces type narrowing before use |
| Zod for runtime validation | ✅ | Validates external/user data at runtime |
| Generated Supabase types | ✅ | `src/lib/database.types.ts` — regenerate after schema changes |

---

## 4. React Component Standards

| Rule | Required | Rationale |
|---|---|---|
| Functional components only | ✅ | Class components are legacy |
| One component per file | ✅ | Improves tree-shaking and discoverability |
| Props interface named `ComponentNameProps` | ✅ | Consistent discoverability |
| `React.memo` only when profiling proves necessary | Recommended | Premature optimisation adds complexity |
| `useCallback` and `useMemo` only for stable references needed by deps | Recommended | Avoid over-memoisation |
| Route-level components lazy-loaded | ✅ | Reduces initial bundle size |
| Error boundary around each feature area | ✅ | Prevents full-page crashes |
| All interactive elements keyboard-accessible | ✅ | WCAG 2.1 AA requirement |

---

## 5. CSS & Tailwind Standards

| Rule | Required | Rationale |
|---|---|---|
| Tailwind utilities as primary styling | ✅ | Consistent design system, purging |
| `cn()` utility for conditional classes | ✅ | Avoids string concatenation bugs |
| CSS custom properties for brand tokens | ✅ | Enables theming |
| No inline `style` for static values | ✅ | Tailwind handles static styles |
| Dark mode variants defined for all colour tokens | ✅ | Full dark mode support |
| No `!important` in custom CSS | ✅ | Indicates a specificity problem |
| Custom CSS only when Tailwind cannot achieve it | ✅ | Reduces maintenance burden |

---

## 6. Supabase & Database Standards

| Rule | Required | Rationale |
|---|---|---|
| RLS enabled on all user-scoped tables | ✅ | Security: prevents unauthorised access |
| `anon` key used client-side only | ✅ | `service_role` key is privileged |
| Single Supabase client instance | ✅ | Avoids connection proliferation |
| Generated TypeScript types used | ✅ | Type-safe DB queries |
| RLS policies cover all CRUD operations | ✅ | Incomplete coverage leaves gaps |
| Migrations in `supabase/migrations/` | ✅ | Version-controlled schema changes |
| No raw SQL in components | ✅ | Use Supabase JS client |

---

## 7. Testing Standards

| Rule | Required | Rationale |
|---|---|---|
| Unit tests for all utility functions | ✅ | Validates pure logic |
| Component tests for user interactions | ✅ | Validates component behaviour |
| `getByRole` preferred over `getByTestId` | ✅ | Tests accessible behaviour |
| No `test.only` / `describe.only` in committed code | ✅ | Prevents silently skipping tests |
| Mocked Supabase client in tests | ✅ | Tests don't require live DB |
| Coverage ≥ 70% statements/functions | ✅ | Enforced in CI |
| Tests must pass on CI | ✅ | Gates merge |

---

## 8. Documentation Standards

| Rule | Required | Rationale |
|---|---|---|
| All docs in `docs/` directory | ✅ | Single source of truth |
| Markdown format | ✅ | Version-controlled, renderer-agnostic |
| `Last Updated` date at bottom | ✅ | Signals freshness |
| Tables for structured reference data | Recommended | Easier to scan |
| Code blocks with language tags | ✅ | Enables syntax highlighting |
| Relative links within `docs/` | ✅ | Works offline and in any git host |
| Docs updated with the PR that changes behaviour | ✅ | Keeps docs in sync |

---

## 9. Branching & Commit Standards

### Branch Names

| Pattern | Use |
|---|---|
| `feature/<short-desc>` | New features |
| `fix/<short-desc>` | Bug fixes |
| `hotfix/<short-desc>` | Critical production fixes |
| `chore/<short-desc>` | Non-functional changes |
| `docs/<short-desc>` | Documentation only |
| `release/<version>` | Release preparation |

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <summary in present tense>
```

| Type | When to Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no logic change) |
| `refactor` | Code restructure (no feature/fix) |
| `test` | Adding or fixing tests |
| `chore` | Build, deps, config |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

---

## 10. Code Review Checklist

### Author's Checklist (before requesting review)

**Correctness**
- [ ] Feature matches the acceptance criteria in the linked issue
- [ ] Loading, error, and empty states handled
- [ ] No console.log statements

**Type Safety**
- [ ] No `any` or `ts-ignore`
- [ ] Zod schema validates all user input
- [ ] Supabase queries use generated types

**Testing**
- [ ] Unit/component tests added for new logic
- [ ] `npm test` passes locally
- [ ] Coverage has not dropped

**Security**
- [ ] No secrets in code
- [ ] User-owned resources protected by RLS
- [ ] `dangerouslySetInnerHTML` not used without sanitisation

**Accessibility**
- [ ] Keyboard-accessible interactive elements
- [ ] `alt` text on all images
- [ ] No AA contrast violations

**Documentation**
- [ ] `docs/` updated if behaviour changed
- [ ] PR description explains the _why_

### Reviewer's Checklist

- [ ] Code is readable and self-explanatory
- [ ] Edge cases handled (auth failure, network error, empty data)
- [ ] No obvious security issues
- [ ] Tests actually test the new behaviour
- [ ] No unnecessary dependencies added

---

## 11. Security Standards

| Rule | Required | Reference |
|---|---|---|
| Secrets only in `.env.local` or Vercel env vars | ✅ | [Security Guide](./08-security.md) |
| `VITE_*` vars must be safe to expose to end users | ✅ | [Security Guide](./08-security.md) |
| `npm audit` passes on every PR | ✅ | CI pipeline |
| No `dangerouslySetInnerHTML` without DOMPurify | ✅ | Prevents XSS |
| All inputs validated with Zod | ✅ | Client + server |
| RLS on all user tables | ✅ | Supabase |

---

## 12. Logging Standards

| Environment | Allowed | Not Allowed |
|---|---|---|
| Development | `console.log`, `console.warn`, `console.error` | — |
| Production | `reportError(err)` via telemetry helper | `console.log` |

```typescript
// src/lib/telemetry.ts
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: context });
  } else {
    console.error('[FlashFusion]', error, context);
  }
}
```

---

*Last Updated: 2026-03-08 | Owner: Engineering Team*
