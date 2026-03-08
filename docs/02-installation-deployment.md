# Installation & Deployment Guide

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers, DevOps

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Environment Variables](#3-environment-variables)
4. [Supabase Setup](#4-supabase-setup)
5. [Build for Production](#5-build-for-production)
6. [Deployment Platforms](#6-deployment-platforms)
7. [Custom Domain Setup](#7-custom-domain-setup)
8. [Environment Management](#8-environment-management)
9. [Rollback Procedure](#9-rollback-procedure)
10. [Deployment Checklist](#10-deployment-checklist)

---

## 1. Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| **Node.js** | 18.x LTS | [nodejs.org](https://nodejs.org) |
| **npm** | 9.x (bundled with Node) | — |
| **Git** | 2.x | [git-scm.com](https://git-scm.com) |
| **Supabase CLI** | 1.x (optional, for migrations) | `npm install -g supabase` |
| **Vercel CLI** | latest (optional) | `npm install -g vercel` |

---

## 2. Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Krosebrook/Flashfusionwebsitev20.git
cd Flashfusionwebsitev20

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and any API keys

# 4. Start the development server
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement (HMR).

### Verify Your Setup

- Visit `http://localhost:5173` — the landing page should load.
- Open the browser console and confirm no critical errors are present.
- Navigate to the login page and verify Supabase connectivity.

---

## 3. Environment Variables

Create a `.env.local` file at the project root. **Never commit this file.**

```dotenv
# ── Supabase ────────────────────────────────────────────────────
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# ── Application ─────────────────────────────────────────────────
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development          # development | staging | production

# ── AI Services (optional, for feature-complete builds) ─────────
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...

# ── Analytics (optional) ────────────────────────────────────────
VITE_MIXPANEL_TOKEN=<token>
VITE_SENTRY_DSN=https://...@sentry.io/...
```

> **Security:** All variables prefixed `VITE_` are embedded into the client bundle at build time and are visible to end users. Never place private server secrets in `VITE_` prefixed variables. Use Supabase Edge Function environment variables for server-side secrets.

See [Configuration Guide](./04-configuration.md) for full variable reference.

---

## 4. Supabase Setup

### Create a Supabase Project

1. Sign in to [app.supabase.com](https://app.supabase.com).
2. Click **New project**, choose a region close to your users.
3. Note your **Project URL** and **anon public key** — add these to `.env.local`.

### Apply Database Migrations

```bash
# Link your local project to Supabase
supabase link --project-ref <project-id>

# Run migrations (if migration files exist)
supabase db push
```

### Enable Authentication Providers

In the Supabase dashboard → **Authentication** → **Providers**:

- Enable **Email** (with email confirmations recommended for production)
- Enable **GitHub** OAuth (register an OAuth App at github.com/settings/developers)
- Enable **Google** OAuth (register at console.cloud.google.com)

### Configure Row-Level Security

RLS must be enabled on every user-owned table. Example policy:

```sql
-- Only the owner can read/write their rows
CREATE POLICY "Users can only access their own data"
ON public.user_projects
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## 5. Build for Production

```bash
# Type-check and build
npm run build

# Preview the production build locally
npx vite preview
```

Output is written to `dist/`. The build is a static SPA; all routes are handled client-side.

### Build Output Verification

```bash
# Check bundle sizes
ls -lh dist/assets/

# Ensure no .env.local values are leaked
grep -r "supabase.co" dist/ || echo "No URLs found (good)"
```

---

## 6. Deployment Platforms

### Vercel (Recommended)

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Manual steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Vercel project settings:**

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 18.x |

Set all `VITE_` environment variables in **Vercel → Project → Settings → Environment Variables** for each environment (Production, Preview, Development).

**SPA Routing (required):** Create `vercel.json` at the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Self-Hosted (NGINX)

```nginx
server {
    listen 80;
    root /var/www/flashfusion/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 7. Custom Domain Setup

### Vercel

1. Go to **Vercel Project → Settings → Domains**.
2. Add your domain (e.g., `flashfusion.dev`).
3. Update your DNS provider with the CNAME records shown.
4. Vercel provisions TLS automatically via Let's Encrypt.

### Update Environment Variables

After pointing a custom domain, update in Vercel dashboard:

```
VITE_APP_URL=https://flashfusion.dev
```

---

## 8. Environment Management

| Environment | Branch | Purpose | Supabase Project |
|---|---|---|---|
| Development | any feature branch | Local development | Dev project (personal) |
| Preview | pull requests | Code review, QA testing | Staging Supabase project |
| Staging | `develop` | Pre-production validation | Staging Supabase project |
| Production | `main` | Live users | Production Supabase project |

> Use separate Supabase projects for staging and production to prevent data contamination.

---

## 9. Rollback Procedure

### Vercel (Instant Rollback)

1. Open **Vercel Dashboard → Deployments**.
2. Find the last known-good deployment.
3. Click **Promote to Production**.

### Manual Rollback via Git

```bash
# Find the last good commit
git log --oneline -10

# Create a rollback branch
git checkout -b hotfix/rollback-<version> <good-commit-sha>

# Push and promote via CI
git push origin hotfix/rollback-<version>
```

---

## 10. Deployment Checklist

Use the [Deployment Checklist Template](./templates/deployment-checklist.md) before each production release.

Quick summary:

- [ ] All environment variables set in Vercel for production environment
- [ ] Supabase RLS policies verified
- [ ] `npm run build` completes without errors
- [ ] Bundle size reviewed (target: < 2 MB gzipped total)
- [ ] No `.env.local` or secrets in build output
- [ ] Smoke test on preview URL before promoting to production
- [ ] Rollback plan documented and verified

---

*Last Updated: 2026-03-08 | Owner: DevOps / Engineering*
