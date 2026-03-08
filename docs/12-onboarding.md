# New Developer Onboarding Checklist

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** New Developers

Welcome to the FlashFusion team! This checklist guides you through everything you need to be productive.

Estimated time to complete: **2–4 hours**

---

## Phase 1 — Access & Accounts (Day 1)

### Repository Access
- [ ] Accepted GitHub repository invitation
- [ ] Confirmed you can view the repository and open issues

### Tooling Accounts
- [ ] Created or have access to a [Supabase](https://supabase.com) account
- [ ] Have access to the team Supabase project (request from team lead)
- [ ] Have access to the Vercel project (request from team lead)
- [ ] Have access to Sentry (if applicable)

### Communication
- [ ] Added to team Slack / Discord workspace
- [ ] Added to relevant channels (`#engineering`, `#deployments`, `#bugs`)
- [ ] Introduced yourself in the team channel

---

## Phase 2 — Local Environment Setup (Day 1)

### Prerequisites
- [ ] Node.js 18.x LTS installed: `node --version` → `v18.x.x`
- [ ] npm 9.x installed: `npm --version`
- [ ] Git 2.x installed: `git --version`

### Project Setup
- [ ] Cloned the repository: `git clone https://github.com/Krosebrook/Flashfusionwebsitev20.git`
- [ ] Installed dependencies: `npm install` (no errors)
- [ ] Created `.env.local` from template: `cp .env.example .env.local`
- [ ] Filled in Supabase URL and anon key in `.env.local`
- [ ] Started dev server: `npm run dev` → site loads at `http://localhost:5173`

### Verify Everything Works
- [ ] Homepage loads without console errors
- [ ] Sign-up flow works (create a test account)
- [ ] Login/logout works
- [ ] Dashboard loads after login

---

## Phase 3 — Codebase Orientation (Day 1–2)

### Documentation Reading
- [ ] Read [Architecture Overview](./01-architecture-overview.md) — understand the system
- [ ] Read [Developer Guide](./03-developer-guide.md) — coding conventions
- [ ] Read [Configuration Guide](./04-configuration.md) — environment variables
- [ ] Read [Security Guide](./08-security.md) — secrets management rules
- [ ] Read [Standards & Conventions](./standards-conventions.md) — naming and folder rules

### Code Exploration
- [ ] Traced the app entry point: `src/main.tsx` → `ApplicationController` → routing
- [ ] Explored `src/components/core/` — app shell and routing
- [ ] Explored `src/components/layout/` — header, footer, navigation
- [ ] Explored `src/components/pages/` — route-level page components
- [ ] Explored `src/components/ui/` — shadcn/ui shared primitives
- [ ] Located `src/lib/supabase.ts` — Supabase client initialisation

### Editor Setup
- [ ] Installed VS Code extensions (recommended):
  - ESLint (`dbaeumer.vscode-eslint`)
  - Prettier (`esbenp.prettier-vscode`)
  - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
  - TypeScript Next (`ms-vscode.vscode-typescript-next`)
- [ ] Configured format-on-save in VS Code settings

---

## Phase 4 — Development Workflow (Day 2–3)

### Git & Branching
- [ ] Read [Versioning & Release Policy](./05-versioning-release.md) — branching strategy
- [ ] Created your first feature branch: `git checkout -b feature/your-name-hello-world`
- [ ] Understand the PR process (PRs go to `develop`, not `main`)

### First Change
- [ ] Made a small, safe change (e.g., updated a comment or a text string)
- [ ] Verified the change appears in the browser
- [ ] Ran `npm test` — all tests pass
- [ ] Ran `npm run type-check` — no TypeScript errors
- [ ] Opened a draft PR and filled out the PR template

### Testing
- [ ] Read [Testing Guide](./07-testing-guide.md)
- [ ] Ran the full test suite: `npm test`
- [ ] Ran tests with coverage: `npm run test:coverage`
- [ ] Wrote a simple unit test for a utility function

---

## Phase 5 — Deployment Understanding (Week 1)

### CI/CD
- [ ] Read [CI/CD Pipeline Documentation](./06-cicd-pipeline.md)
- [ ] Observed a PR go through CI checks
- [ ] Understand when preview deployments are created (every PR)
- [ ] Understand how to find your PR's preview URL in the Vercel dashboard

### Production Environment
- [ ] Can access the production URL
- [ ] Understand the staging → production promotion process
- [ ] Read [Operational Runbook](./13-runbook.md) — incident response

---

## Phase 6 — First Contribution (Week 1–2)

- [ ] Picked up a `good first issue` from the issue tracker
- [ ] Implemented the fix or feature on a feature branch
- [ ] Written tests for your change
- [ ] Opened a PR with a complete PR template
- [ ] Addressed review feedback
- [ ] PR merged to `develop`

---

## Contacts & Resources

| Resource | Location |
|---|---|
| Repository | https://github.com/Krosebrook/Flashfusionwebsitev20 |
| Issue tracker | GitHub Issues |
| Documentation | `docs/` directory in the repository |
| Supabase dashboard | https://app.supabase.com |
| Vercel dashboard | https://vercel.com |
| Team lead | _[Fill in contact]_ |
| On-call escalation | See [Operational Runbook](./13-runbook.md) |

---

## Frequently Asked First-Day Questions

**Q: Where do I put new code?**  
A: Feature components go in `src/components/<feature-name>/`. Shared utilities in `src/lib/`. Custom hooks in `src/hooks/`.

**Q: How do I query the database?**  
A: Use the Supabase JS client from `src/lib/supabase.ts`. See [API Reference](./11-api-reference.md) for examples.

**Q: Where do I add a new page/route?**  
A: Create a component in `src/components/pages/` and register the route in `src/components/core/AppRouteHandler.tsx`.

**Q: What is the design system?**  
A: shadcn/ui (Radix UI + Tailwind CSS). Use components from `src/components/ui/`. Avoid writing raw CSS.

**Q: How do I safely handle an API key I need for my feature?**  
A: Read [Security Guide](./08-security.md). Server-side keys go in Supabase Edge Function environment variables. Client-safe public keys go in `VITE_*` environment variables.

---

*Last Updated: 2026-03-08 | Owner: Engineering Team*
