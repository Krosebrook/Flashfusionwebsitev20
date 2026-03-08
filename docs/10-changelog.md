# Changelog / Upgrade Notes

**Version:** 2.1.0 | **Last Updated:** 2026-03-08

All notable changes to FlashFusion are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Complete implementation of placeholder AI tools (Q2 2026)
- Performance optimisation — target bundle size reduction to Grade B+
- WCAG 2.1 AA accessibility compliance pass
- Mobile responsiveness improvements across all pages
- Next.js 14+ migration evaluation and proof of concept
- Playwright end-to-end test suite
- Runtime feature flags via Supabase
- AI API integrations: OpenAI and Anthropic Claude

---

## [2.1.0] — 2026-01-13

### Added
- Comprehensive `docs/` directory with all required documentation (this file)
- `docs/README.md` — documentation index and navigation guide
- Architecture Overview, Developer Guide, Security Guide, Testing Guide, and all supporting docs
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml` and `feature_request.yml`
- Documentation gap analysis and phased update plan

### Changed
- Updated root `README.md` with full project overview, tech stack, and documentation links
- Documentation migrated from scattered `src/` files to canonical `docs/` directory

### Infrastructure
- GitHub Actions workflow stubs documented in CI/CD guide
- Vercel deployment configuration patterns documented

---

## [2.0.0] — 2026-01-12

### Added — Major Platform Release

**Core Application Architecture**
- React 18.3.1 with TypeScript strict mode
- Vite 6.3.5 build system with optimised configuration
- FlashFusion design system with CSS custom property tokens
- Error boundary system (`ErrorBoundaryEnhanced`, `TimeoutErrorBoundary`)
- Loading state management with branded components

**Authentication System** ✅
- Supabase authentication integration
- Email/password authentication
- OAuth provider support (GitHub, Google)
- Protected route system (`ProtectedRoute` wrapper)
- Session management with automatic token refresh
- Mobile-optimised auth flows

**Routing & Navigation** ✅
- Client-side routing system
- Protected and public route separation
- Navigation header with user state
- Mobile-responsive navigation
- Breadcrumb system
- Route-based code splitting

**Landing Page & Marketing** ✅
- SEO-optimised landing page
- Feature showcase sections
- Pricing page with tier comparisons
- Testimonials and social proof
- FAQ section with dropdown accordions
- Contact and support pages

**Dashboard Interface** ✅
- User dashboard with project overview
- Analytics display components (Recharts)
- Dark mode support via `next-themes`

**UI Component Library** ✅
- Full shadcn/ui component set (Radix UI + Tailwind)
- Custom FlashFusion brand tokens
- Professional icon system (Lucide React)
- Premium micro-interaction animations (Motion)

**Automation Features** (Placeholder)
- `AutomationFlowBuilder` — visual automation flow editor UI
- `NoCodeWorkflowBuilder` — no-code workflow creation UI

**Testing Infrastructure** (UI Components)
- `AutomatedRegressionTester` — regression test runner UI
- `ComprehensiveIntegrationTestSuite` — integration test UI
- `LaunchStabilityTester` — stability test UI
- `TestSuiteOrchestrator` — test orchestration UI

### Technical Details
- Supabase JS v2 client integration
- React Hook Form v7 + Zod validation
- Recharts v2 for data visualisation
- Radix UI full primitive set

---

## [1.0.0] — Initial Release (Figma Make export)

- Initial codebase generated from Figma design: [FlashFusionWebsite (Copy)](https://www.figma.com/design/zUXETPxCx03cbuEuxidAnJ/FlashFusionWebsite--Copy-)
- Basic React + Vite scaffold
- Tailwind CSS styling

---

## Upgrade Notes

### v2.0.0 → v2.1.0

No breaking changes. Documentation reorganisation only.

- All documentation previously in `src/*.md` and `src/docs/` is superseded by `docs/`.
- `src/docs/` files are retained as archived references but should not be updated.

### v1.0.0 → v2.0.0

Full rewrite from initial Figma export. No migration path — fresh install recommended.

---

*Last Updated: 2026-03-08 | Owner: Engineering*
