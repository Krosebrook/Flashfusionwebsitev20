
# FlashFusion

**FlashFusion** is an AI-powered development platform and creator toolkit that transforms ideas into production-ready applications. It provides 60+ AI tools, multi-agent orchestration, no-code workflow automation, and full-stack deployment capabilities through a modern React/TypeScript web interface backed by Supabase.

> **Version:** 2.1.0 | **Status:** Active Development | **Stack:** React 18 · TypeScript · Vite · Supabase · Tailwind CSS

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials and API keys

# 3. Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

---

## 📚 Documentation

Full documentation lives in the [`docs/`](./docs/) directory.

| Document | Description |
|---|---|
| [Architecture Overview](./docs/01-architecture-overview.md) | System design, tech stack, data flow |
| [Installation & Deployment](./docs/02-installation-deployment.md) | Setup, build, and deploy instructions |
| [Developer Guide](./docs/03-developer-guide.md) | Coding conventions, patterns, component guidelines |
| [Configuration Guide](./docs/04-configuration.md) | Environment variables and customisation |
| [Versioning & Release Policy](./docs/05-versioning-release.md) | Semantic versioning, branching, release process |
| [CI/CD Pipeline](./docs/06-cicd-pipeline.md) | Automated build, test, and deployment pipeline |
| [Testing Guide](./docs/07-testing-guide.md) | Unit and integration testing strategy |
| [Security Guide](./docs/08-security.md) | Data handling, secrets management, compliance |
| [Troubleshooting](./docs/09-troubleshooting.md) | Common issues and solutions |
| [Changelog](./docs/10-changelog.md) | Version history and upgrade notes |
| [API Reference](./docs/11-api-reference.md) | Endpoint documentation |
| [Onboarding Checklist](./docs/12-onboarding.md) | New developer setup checklist |
| [Operational Runbook](./docs/13-runbook.md) | Production operations and incident response |
| [Standards & Conventions](./docs/standards-conventions.md) | Naming, folder structure, code review checklist |
| [Gap Analysis](./docs/gap-analysis.md) | Documentation inventory and coverage assessment |
| [Update Plan](./docs/update-plan.md) | Phased documentation update timeline |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 6 |
| UI | Radix UI primitives, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions, Realtime) |
| State | React Context + hooks |
| Testing | Vitest, React Testing Library |
| Deployment | Vercel (recommended) |

---

## 📁 Project Structure

```
flashfusion/
├── docs/                     # Organised documentation (canonical)
│   ├── templates/            # Reusable doc & PR templates
│   └── *.md                  # All primary doc files
├── src/
│   ├── components/
│   │   ├── core/             # App shell, routing, providers
│   │   ├── layout/           # Header, footer, navigation
│   │   ├── pages/            # Route-level page components
│   │   ├── ui/               # Shared shadcn/ui primitives
│   │   ├── automation/       # Workflow automation components
│   │   └── testing/          # QA / regression components
│   ├── docs/                 # Legacy in-source docs (archived)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helpers
│   └── main.tsx              # Application entry point
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🤝 Contributing

Please read the [Developer Guide](./docs/03-developer-guide.md) and [Standards & Conventions](./docs/standards-conventions.md) before submitting a pull request.

Use the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) and ensure all checklist items are complete.

---

## 📄 License

See [LICENSE](./LICENSE) for details.

---

*Original Figma design: [FlashFusionWebsite (Copy)](https://www.figma.com/design/zUXETPxCx03cbuEuxidAnJ/FlashFusionWebsite--Copy-)*
  