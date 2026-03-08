# Architecture Overview

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Status:** Production-Ready Core

---

## 1. Project Summary

FlashFusion is a comprehensive AI-powered development platform and creator toolkit built as a Single Page Application (SPA). It provides content creators and developers with 60+ AI tools, multi-agent workflow orchestration, no-code automation builders, and one-click deployment capabilities. The platform targets modern browsers and is deployed on Vercel with Supabase as the managed backend. The frontend is built with React 18, TypeScript, and Vite; the backend leverages Supabase's PostgreSQL database, authentication service, edge functions (Hono), and realtime subscriptions.

---

## 2. Table of Contents

1. [Executive Summary](#1-project-summary)
2. [High-Level Architecture Diagram](#3-high-level-architecture-diagram)
3. [Technology Stack](#4-technology-stack)
4. [Application Structure](#5-application-structure)
5. [Component Architecture](#6-component-architecture)
6. [Data Flow & State Management](#7-data-flow--state-management)
7. [Authentication & Authorization](#8-authentication--authorization)
8. [Backend Services](#9-backend-services)
9. [Design System](#10-design-system)
10. [Performance Optimization](#11-performance-optimization)
11. [Security Architecture](#12-security-architecture)
12. [Deployment Architecture](#13-deployment-architecture)
13. [Known Limitations & Technical Debt](#14-known-limitations--technical-debt)
14. [Future Architecture Plans](#15-future-architecture-plans)

---

## 3. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Desktop Browser · Tablet Browser · Mobile Browser · PWA(future)│
│                                                                  │
│           React 18 + TypeScript (Vite 6 build)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│          Supabase Edge Functions (Hono framework)                │
│     Auth Middleware · Server Routes · CORS · Rate Limiting       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       DATA LAYER                                 │
│               Supabase Platform (managed)                        │
│  PostgreSQL Database · Auth Service · Storage Bucket             │
│  Realtime Subscriptions · Row-Level Security (RLS)               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│            EXTERNAL SERVICES (planned / partial)                 │
│  AI APIs (OpenAI, Claude) · GitHub API · Vercel API · Monitoring │
└─────────────────────────────────────────────────────────────────┘
```

> **Architecture Pattern:** SPA with client-side routing, Supabase as BaaS, edge functions for server-side logic. A planned migration to Next.js 14+ is under evaluation for improved SSR and SEO.

---

## 4. Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Frontend framework** | React | 18.3.1 | Hooks-based, concurrent features |
| **Language** | TypeScript | 5.x | Strict mode enabled |
| **Build tool** | Vite | 6.3.5 | ESM-native, fast HMR |
| **UI components** | Radix UI Primitives | various | Accessible, unstyled primitives |
| **Styling** | Tailwind CSS | 3.x | Utility-first |
| **Component library** | shadcn/ui (custom) | — | Tailwind + Radix compositions |
| **Animation** | Motion (Framer Motion v11) | * | Page transitions, micro-interactions |
| **Forms** | React Hook Form + Zod | 7.x / * | Schema validation |
| **Charts** | Recharts | 2.15.2 | Dashboard analytics |
| **Backend/BaaS** | Supabase | 2.x | PostgreSQL, Auth, Storage, Realtime |
| **Edge functions** | Hono | * | Lightweight web framework |
| **Testing** | Vitest + React Testing Library | * | Unit and integration tests |
| **State management** | React Context + hooks | — | No external state library |
| **HTTP client** | Supabase JS client | 2.x | Auto-generated types |
| **Deployment** | Vercel | — | Preview & production environments |

---

## 5. Application Structure

```
flashfusion/
├── docs/                         # Canonical documentation
├── public/                       # Static assets served at root
├── src/
│   ├── components/
│   │   ├── core/                 # App shell, routing, providers, performance
│   │   │   ├── AppCoreOptimized.tsx
│   │   │   ├── AppRouteHandler.tsx
│   │   │   ├── AppSystemInitializer.tsx
│   │   │   └── ApplicationController.tsx
│   │   ├── layout/               # Persistent UI chrome
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppFooter.tsx
│   │   │   ├── AppMobileNavigation.tsx
│   │   │   └── ApplicationShell.tsx
│   │   ├── pages/                # Route-level page components
│   │   ├── ui/                   # Shared shadcn/ui primitives
│   │   ├── automation/           # Workflow automation builders
│   │   │   ├── AutomationFlowBuilder.tsx
│   │   │   └── NoCodeWorkflowBuilder.tsx
│   │   ├── testing/              # QA / regression testing components
│   │   ├── providers/            # React context providers
│   │   ├── debug/                # Development-only diagnostics
│   │   ├── integrations/         # Third-party integration hubs
│   │   └── system-apps/          # Cross-app workspace features
│   ├── docs/                     # Legacy in-source docs (archived)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Shared utilities and helpers
│   ├── styles/                   # Global CSS and Tailwind config
│   └── main.tsx                  # Application entry point
├── index.html                    # HTML shell
├── vite.config.ts                # Build configuration
├── package.json
└── .env.example                  # Environment variable template
```

---

## 6. Component Architecture

### Hierarchy

```
Application
└── ApplicationController        # Top-level app orchestration
    └── AppProvider              # Context providers (auth, theme, etc.)
        └── ApplicationShell     # Layout chrome
            ├── AppHeader        # Top navigation bar
            ├── AppMobileNavigation
            ├── AppRouteHandler  # Client-side routing
            │   └── [PageComponents]  # Feature page views
            └── AppFooter
```

### Component Conventions

| Convention | Rule | Rationale |
|---|---|---|
| **File naming** | `PascalCase.tsx` | Consistent with React component naming |
| **Directory naming** | `kebab-case/` | Consistent with filesystem norms |
| **Component type** | Functional + hooks | Preferred modern React pattern |
| **Props interface** | `ComponentNameProps` | Discoverable, avoids naming conflicts |
| **Default export** | One component per file | Improves tree-shaking and lazy loading |
| **Co-location** | Tests alongside source | Easier maintenance |

---

## 7. Data Flow & State Management

### State Categories

| Category | Solution | Scope |
|---|---|---|
| **Server state** | Supabase JS client (direct queries) | Global / feature |
| **Authentication state** | Supabase Auth + React Context | Global |
| **UI / ephemeral state** | `useState`, `useReducer` | Component |
| **Form state** | React Hook Form | Component |
| **Theme** | `next-themes` + CSS variables | Global |

### Data Flow Pattern

```
User Action → Component Handler → Supabase Client → PostgreSQL
                                       ↕ Realtime
                     Component State ← Subscription
```

> **Assumption:** No Redux or Zustand is used. Global state is passed via Context providers only for cross-cutting concerns (auth, theme). Feature state is co-located with feature components.

---

## 8. Authentication & Authorization

| Feature | Implementation |
|---|---|
| **Provider** | Supabase Auth |
| **Methods** | Email/password, OAuth (GitHub, Google) |
| **Session storage** | `localStorage` via Supabase JS |
| **Route protection** | `ProtectedRoute` wrapper component |
| **Row-level security** | Supabase RLS policies on all user-owned tables |
| **Token refresh** | Automatic via Supabase JS client |
| **Mobile auth** | Optimised login/signup flows for mobile viewports |

---

## 9. Backend Services

All backend logic is handled by Supabase managed services and edge functions.

| Service | Purpose | Notes |
|---|---|---|
| **PostgreSQL** | Primary data store | Supabase hosted, RLS enabled |
| **Supabase Auth** | User identity and sessions | JWT-based |
| **Supabase Storage** | File uploads (user assets) | Bucket-level policies |
| **Edge Functions** | Custom server logic (Hono) | Deno runtime |
| **Realtime** | Live collaboration, notifications | Supabase channels |

> **External AI APIs** (OpenAI, Anthropic Claude) are planned integrations; the current platform uses placeholder implementations for AI features.

---

## 10. Design System

| Element | Implementation |
|---|---|
| **Tokens** | CSS custom properties (`--flashfusion-*`) in `globals.css` |
| **Primitives** | Radix UI (accessible, unstyled) |
| **Compositions** | shadcn/ui patterns customised for FlashFusion brand |
| **Icons** | Lucide React (v0.487) |
| **Typography** | Tailwind typography utilities + custom font variables |
| **Motion** | Motion library for page transitions and micro-interactions |
| **Responsive** | Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`, `xl`) |

---

## 11. Performance Optimization

| Strategy | Detail |
|---|---|
| **Code splitting** | Route-based dynamic `import()` via Vite |
| **Bundle analysis** | `vite build --report` for size inspection |
| **Image optimization** | `loading="lazy"` on all below-fold images |
| **Memoization** | `React.memo`, `useMemo`, `useCallback` for expensive renders |
| **Error boundaries** | `ErrorBoundaryEnhanced` and `TimeoutErrorBoundary` components |
| **Memory monitoring** | `MemoryMonitor` development component for tracking heap usage |
| **Lite mode** | `LiteModeIndicator` — reduced-motion / lower-resource UI mode |

> **Known issue:** Current bundle size is above target. The principal-level audit rated performance Grade C–. See [Known Limitations](#14-known-limitations--technical-debt).

---

## 12. Security Architecture

| Control | Detail |
|---|---|
| **Transport** | HTTPS enforced on all endpoints |
| **Authentication** | JWT tokens, automatic rotation via Supabase |
| **Database** | Row-Level Security policies per table |
| **Secrets** | API keys stored in environment variables only, never committed |
| **CSP** | Content Security Policy headers via Vercel config |
| **Input validation** | Zod schemas on all form inputs |
| **Dependency audit** | `npm audit` run as part of CI pipeline |

See [Security Guide](./08-security.md) for full details.

---

## 13. Deployment Architecture

| Environment | Platform | URL pattern | Branch |
|---|---|---|---|
| **Development** | Local (Vite dev server) | `localhost:5173` | any feature branch |
| **Preview** | Vercel (per-PR) | `<hash>.vercel.app` | pull requests |
| **Staging** | Vercel | `staging.flashfusion.dev` | `develop` |
| **Production** | Vercel | `flashfusion.dev` | `main` |

Build command: `npm run build` → `vite build`
Output directory: `dist/`

---

## 14. Known Limitations & Technical Debt

| Item | Severity | Status |
|---|---|---|
| Many AI features are placeholder implementations | High | Planned |
| Bundle size above target (Grade C– audit) | High | In progress |
| WCAG 2.1 AA accessibility gaps | Medium | Planned |
| Mobile responsiveness issues on several pages | Medium | In progress |
| No Next.js SSR (SEO impact for landing pages) | Medium | Under evaluation |
| Scattered documentation in `src/` | Low | Resolved by `docs/` migration |

---

## 15. Future Architecture Plans

| Initiative | Target | Notes |
|---|---|---|
| **Next.js 14+ migration** | Q3 2026 | SSR for SEO, app router |
| **AI service integrations** | Q2 2026 | OpenAI + Anthropic APIs |
| **PWA support** | Q4 2026 | Service worker, offline mode |
| **Monorepo migration** | Q3 2026 | Turborepo for shared packages |
| **Rate limiting** | Q2 2026 | Edge function middleware |

---

## Assumptions

- Supabase project is already provisioned with the correct schema.
- The Vercel project is linked to the repository with auto-deploy on `main`.
- No server-rendered pages currently exist; all routing is client-side.

---

*Last Updated: 2026-03-08 | Owner: Engineering Team*
