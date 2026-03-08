# Security & Data Handling Guide

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers, DevOps

---

## Table of Contents

1. [Security Principles](#1-security-principles)
2. [Secrets Management](#2-secrets-management)
3. [Authentication & Authorisation](#3-authentication--authorisation)
4. [Input Validation & Sanitisation](#4-input-validation--sanitisation)
5. [Row-Level Security (RLS)](#5-row-level-security-rls)
6. [Transport Security](#6-transport-security)
7. [Content Security Policy](#7-content-security-policy)
8. [Dependency Security](#8-dependency-security)
9. [Data Privacy & Handling](#9-data-privacy--handling)
10. [Incident Response](#10-incident-response)
11. [Security Checklist](#11-security-checklist)

---

## 1. Security Principles

| Principle | Implementation |
|---|---|
| **Least privilege** | Use the Supabase `anon` key client-side; never expose `service_role` key |
| **Defence in depth** | Validate inputs client-side _and_ enforce RLS server-side |
| **Fail securely** | Return generic error messages to users; log details server-side |
| **No security through obscurity** | Assume the client bundle is readable; protect data server-side |
| **Shift left** | `npm audit` runs in CI on every PR; vulnerabilities block merge |

---

## 2. Secrets Management

### What Counts as a Secret

- Supabase `service_role` key (must **never** be in client code)
- AI API keys (OpenAI, Anthropic)
- OAuth client secrets (GitHub, Google)
- Monitoring tokens (Sentry, Mixpanel)
- Vercel deploy tokens

### Storage Rules

| Location | Allowed Content |
|---|---|
| `.env.local` (gitignored) | Local development secrets |
| Vercel environment variables | Production/staging secrets |
| GitHub Actions secrets | CI secrets (Vercel token, etc.) |
| Supabase Edge Function env vars | Server-side API keys |
| Source code / `package.json` | ❌ Never — not even commented out |
| Git history | ❌ Never |

### Detecting Leaked Secrets

Configure [git-secrets](https://github.com/awslabs/git-secrets) or [gitleaks](https://github.com/gitleaks/gitleaks) as a pre-commit hook:

```bash
# Install gitleaks
brew install gitleaks

# Scan the repo
gitleaks detect --source . -v
```

If a secret is accidentally committed:
1. Revoke the secret immediately at the source (Supabase, GitHub, etc.)
2. Remove it from history using `git filter-repo` or BFG Repo Cleaner
3. Force-push the cleaned history after team coordination
4. Notify affected stakeholders

---

## 3. Authentication & Authorisation

### Supabase Auth

- Authentication is handled exclusively by Supabase Auth — no custom JWT signing.
- Session tokens are stored in `localStorage` by the Supabase JS client.
- Tokens are automatically refreshed; no manual refresh logic needed.

### Protected Routes

All authenticated pages use the `ProtectedRoute` wrapper:

```typescript
// Usage
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

`ProtectedRoute` checks the auth session and redirects to `/login` if unauthenticated.

### OAuth Providers

- OAuth client secrets are stored server-side in Supabase — never client-side.
- Redirect URLs are explicitly allowlisted in Supabase project settings.

### Authorisation

- User-scoped data access is enforced by Supabase RLS policies (see [Section 5](#5-row-level-security-rls)).
- Role-based access (admin vs. regular user) is checked via a `user_roles` table and JWT custom claims.

---

## 4. Input Validation & Sanitisation

### Client-Side Validation (Zod)

All form inputs must be validated with a Zod schema before submission:

```typescript
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

### Server-Side Validation (Edge Functions)

Edge functions re-validate all inputs independently — client-side validation is convenience only, not a security control.

### Preventing XSS

- React escapes JSX values by default. **Never** use `dangerouslySetInnerHTML` without explicit sanitisation with DOMPurify.
- URLs from user input must be validated before use in `href` or `src` attributes.

```typescript
// ✅ Safe URL validation
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

---

## 5. Row-Level Security (RLS)

Every Supabase table that contains user data **must** have RLS enabled with appropriate policies.

### Enable RLS on a Table

```sql
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
```

### Standard Policy Patterns

```sql
-- Users can only read their own rows
CREATE POLICY "select_own_rows" ON public.user_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert rows for themselves
CREATE POLICY "insert_own_rows" ON public.user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "update_own_rows" ON public.user_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "delete_own_rows" ON public.user_projects
  FOR DELETE USING (auth.uid() = user_id);
```

### Verifying RLS Policies

Run this query in the Supabase SQL editor to list all tables without RLS enabled:

```sql
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_tables pt
    JOIN pg_class c ON c.relname = pt.tablename
    WHERE c.relrowsecurity = true AND schemaname = 'public'
  );
```

---

## 6. Transport Security

- All production traffic is served over **HTTPS** (enforced by Vercel and Supabase).
- HTTP to HTTPS redirects are configured in `vercel.json`.
- HSTS headers are set by Vercel automatically.
- WebSocket connections (Supabase Realtime) use `wss://`.

---

## 7. Content Security Policy

Add a CSP header via `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

> Note: `'unsafe-inline'` for scripts is a temporary allowance due to Vite's inline script injection. Migrate to a nonce-based CSP when moving to SSR.

---

## 8. Dependency Security

### Automated Audits

`npm audit` runs on every PR and blocks merge on high or critical vulnerabilities.

### Manual Review

```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update a specific package
npm update <package-name>
```

### Vetting New Dependencies

Before adding a dependency, verify:

- [ ] Active maintenance (last commit < 6 months ago)
- [ ] No known high/critical CVEs (`npm audit` after install)
- [ ] Reasonable download count (> 100k weekly) indicating community trust
- [ ] MIT or Apache 2.0 licence compatible with commercial use
- [ ] Bundle size impact acceptable (check via [bundlephobia.com](https://bundlephobia.com))

---

## 9. Data Privacy & Handling

### Data Collected

| Data Type | Purpose | Retention |
|---|---|---|
| Email address | Authentication, notifications | Until account deletion |
| Profile data | User preferences, display | Until account deletion |
| Project data | User-created content | Until deleted by user |
| Usage analytics | Product improvement | 90 days (anonymised) |
| Error logs | Bug fixing | 30 days |

### Data Storage

- All user data is stored in the Supabase PostgreSQL database within the region selected at project creation.
- No PII is stored in client-side browser storage beyond what Supabase Auth requires for sessions.

### Data Deletion

Users can request account and data deletion from their account settings. Implement the deletion flow using `supabase.auth.admin.deleteUser()` (server-side) and cascade deletes in the database schema.

### GDPR / Privacy Considerations

- Provide a Privacy Policy accessible from the footer.
- Do not track users without explicit consent (cookie banner for analytics).
- Ensure data processors (Supabase, Vercel, Sentry) have GDPR-compliant DPAs.

---

## 10. Incident Response

### Severity Levels

| Severity | Description | Response Time |
|---|---|---|
| **P0 – Critical** | Production down, data breach | Immediate (< 1 hour) |
| **P1 – High** | Major feature broken, security vulnerability | < 4 hours |
| **P2 – Medium** | Feature degraded, non-critical data issue | < 24 hours |
| **P3 – Low** | Minor UX issue, documentation error | Next sprint |

### P0/P1 Response Steps

1. **Detect** — alert from monitoring (Sentry / Vercel Analytics) or user report.
2. **Assess** — determine blast radius and severity.
3. **Contain** — rollback deployment if code-related (see [Rollback Procedure](./02-installation-deployment.md#9-rollback-procedure)).
4. **Communicate** — notify stakeholders via Slack/email within 30 minutes.
5. **Remediate** — deploy a fix via hotfix branch.
6. **Post-mortem** — document root cause, timeline, and prevention measures within 48 hours.

For security incidents (data breach, leaked credentials), additionally:
- Revoke affected credentials immediately.
- Notify affected users within 72 hours (GDPR requirement).

---

## 11. Security Checklist

### Per-PR Checklist

- [ ] No secrets or API keys in code
- [ ] User inputs validated with Zod
- [ ] `dangerouslySetInnerHTML` not used (or sanitised with DOMPurify)
- [ ] New Supabase tables have RLS enabled and policies defined
- [ ] `npm audit` passes with no high/critical issues

### Pre-Release Checklist

- [ ] All environment variables for production set (not using dev values)
- [ ] Supabase service_role key not referenced client-side
- [ ] CSP headers reviewed
- [ ] Dependency vulnerabilities resolved
- [ ] Error messages shown to users are generic (no stack traces)

---

*Last Updated: 2026-03-08 | Owner: Engineering / DevOps*
