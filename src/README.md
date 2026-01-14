# FlashFusion ⚡ - AI Development Platform

<div align="center">
  <img src="https://img.shields.io/badge/Status-Beta%20Development-yellow" alt="Beta Development"/>
  <img src="https://img.shields.io/badge/Version-2.1.0-ff7b00" alt="Version"/>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"/>
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-Enabled-00b4d8" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Completion-35--40%25-orange" alt="Completion"/>
</div>

<div align="center">
  <h3>🎯 Transform Ideas into Production-Ready Applications</h3>
  <p>AI-powered development platform with intelligent orchestration and automation</p>
  <p><strong>⚠️ Currently in Beta - Core features functional, advanced AI features in development</strong></p>
</div>

---

## 🌟 Platform Overview

**FlashFusion** is an AI-powered development platform designed to streamline the software development workflow. Built with React 18, TypeScript, and Supabase, it provides a solid foundation for AI-assisted development, project management, and deployment automation.

### Current Status (v2.1.0)

**What's Working ✅**
- 🔐 **Complete Authentication** - Email/password + OAuth (GitHub, Google)
- 🎨 **Production-Ready UI** - 50+ components with FlashFusion design system
- 🧪 **Interactive AI Demos** - Try AI features with built-in Demo Mode (no API keys required)
- 📊 **Project Dashboard** - Basic project management and analytics
- 🚀 **Deployment Ready** - Configured for Vercel/Netlify deployment
- 📱 **Responsive Design** - Mobile-friendly layouts (improvements ongoing)

**In Development ⚠️**
- 🤖 **Live AI Integration** - Connect your own API keys for real production code generation
- 🔄 **Workflow Automation** - Visual workflow builder (UI mockup complete)
- 📈 **Advanced Analytics** - User behavior tracking (mock data currently)
- 👥 **Team Collaboration** - Multi-user features (planned for Phase 4)

**See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed feature breakdown**

---

## ✨ Core Features

### Available Now ✅
- 🔐 **Secure Authentication** with Supabase (email, OAuth)
- 🎨 **Modern UI Components** (50+ Radix UI based components)
- 📊 **Project Management** dashboard
- 🎯 **Responsive Design** for all devices
- 🎨 **FlashFusion Design System** with custom theming
- 📝 **Form Management** with validation

### Coming Soon 🚧 (Q1-Q2 2026)
- 🤖 **AI Code Generator** - Multi-language code generation
- 📝 **AI Content Creator** - Blog posts, social media, marketing copy
- 🚀 **Smart Deployment** - One-click deployment to multiple platforms
- 📊 **Real Analytics** - User behavior and performance tracking
- 🔄 **Workflow Builder** - Visual automation editor

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.x (strict mode)
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS v4 with CSS variables
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React 0.487.0
- **Animations:** Motion (Framer Motion)
- **Forms:** React Hook Form 7.55.0 + Zod
- **Charts:** Recharts 2.15.2
- **Notifications:** Sonner 2.0.3

### Backend
- **Platform:** Supabase
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Edge Functions:** Hono (Deno runtime)
- **Real-time:** Supabase Realtime (WebSocket)

### Development Tools
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky
- **Type Checking:** TypeScript

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn** or **pnpm**
- **Git**
- **Supabase account** (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krosebrook/Flashfusionwebsitev20.git
   cd Flashfusionwebsitev20
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: Service role key (backend only, never expose to frontend)
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   
   **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project or select existing
   - Go to Settings → API
   - Copy `Project URL` and `anon/public key`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

### AI Service Configuration

FlashFusion supports two modes of operation for AI features:

1.  **Demo Mode (Default)**:
    - Works out of the box without any API keys.
    - Uses simulated AI responses for testing UI and workflows.
    - Toggle via the switch in the AI Tools Hub.

2.  **Production Mode**:
    - Connects to real AI providers (OpenAI, Anthropic, Gemini).
    - Requires API keys in your `.env.local` file:
    ```env
    VITE_OPENAI_API_KEY=sk-...
    VITE_ANTHROPIC_API_KEY=sk-ant-...
    VITE_GEMINI_API_KEY=...
    ```

### First Time Setup

1. **Create an account** - Sign up with email or OAuth
2. **Explore the dashboard** - See project overview
3. **Try core features** - Test authentication, navigation
4. **Check documentation** - Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

---

## 📁 Project Structure

```
flashfusion/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # ✅ Authentication (complete)
│   │   ├── core/           # ✅ Core app logic (complete)
│   │   ├── landing/        # ✅ Landing page (complete)
│   │   ├── pages/          # ✅ Page components (complete)
│   │   ├── tools/          # ⚠️ AI tools (UI only, needs backend)
│   │   ├── workflows/      # ⚠️ Workflows (placeholder)
│   │   └── ui/             # ✅ UI library (complete)
│   │
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   ├── styles/             # Global styles & design system
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
│
├── supabase/
│   ├── functions/          # Edge Functions
│   │   └── server/         # Hono API server
│   └── migrations/         # Database migrations
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE_OVERVIEW.md
│   ├── QUICK_START.md
│   └── ...
│
├── public/                 # Static assets
├── CHANGELOG.md            # ✅ Version history
├── ARCHITECTURE.md         # ✅ Technical architecture
├── ROADMAP.md              # ✅ Future plans
├── IMPLEMENTATION_STATUS.md # ✅ Current status
└── package.json            # Dependencies

✅ = Complete | ⚠️ = In Progress | 🔴 = Planned
```

---

## 🧪 Testing

```bash
# Run tests once
npm run test:run

# Run tests in watch mode  
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:ci
```

**Current Test Coverage:** ~15% (Target: 60%+ for Phase 1)  
See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for testing roadmap.

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ci        # Tests with coverage
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript strict mode
   - Use FlashFusion design system (see [Guidelines.md](Guidelines.md))
   - Write tests for new features
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the `dist` folder to your hosting platform
# (Netlify, Vercel, AWS S3, etc.)
```

### Environment Variables (Production)

Make sure to set these in your hosting platform:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

**Important:** Never commit `.env` files or expose service role keys in frontend code.

---

## 🎨 Design System

FlashFusion uses a comprehensive design system documented in [Guidelines.md](Guidelines.md).

### Brand Colors
- **Primary Orange:** `#FF7B00` - Main brand color, CTAs
- **Secondary Cyan:** `#00B4D8` - Secondary actions, accents  
- **Accent Magenta:** `#E91E63` - Highlights, special elements
- **BG Dark Navy:** `#0F172A` - Primary background
- **Surface Slate:** `#1E293B` - Card backgrounds

### Typography
- **Primary Font:** Sora (headings, labels, buttons)
- **Secondary Font:** Inter (body text, paragraphs)
- **Monospace Font:** JetBrains Mono (code blocks)

### CSS Variables
```css
/* Access design tokens */
var(--ff-primary)      /* Primary color */
var(--ff-bg-dark)      /* Background */
var(--ff-text-primary) /* Text color */
var(--ff-font-primary) /* Heading font */
/* See /src/styles/globals.css for all variables */
```

---

## 📊 Project Status & Roadmap

### Current Version: 2.1.0 (January 2026)

**Completion Status:** ~35-40% production-ready

| Phase | Timeline | Status | Focus |
|-------|----------|--------|-------|
| **Phase 1: Stabilization** | Q1 2026 | 🚧 In Progress | Performance, accessibility, simplification |
| **Phase 2: Migration** | Q2 2026 | 📋 Planned | Next.js 14+, backend restructuring |
| **Phase 3: AI Features** | Q3 2026 | 📋 Planned | Real AI integrations, workflows |
| **Phase 4: Enterprise** | Q4 2026 | 📋 Planned | Team features, scalability |

**Detailed roadmap:** [ROADMAP.md](ROADMAP.md)  
**Implementation status:** [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)  
**Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)  
**Changes:** [CHANGELOG.md](CHANGELOG.md)

---

## 📝 Documentation

### For Users
- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[User Manual](docs/USER_MANUAL.md)** - Comprehensive user guide *(in progress)*
- **[FAQ](docs/FAQ.md)** - Frequently asked questions *(planned)*

### For Developers
- **[Architecture Overview](ARCHITECTURE.md)** - Technical architecture
- **[Development Setup](docs/DEVELOPMENT_SETUP.md)** - Development environment
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Design System](Guidelines.md)** - FlashFusion design guidelines
- **[API Reference](docs/API_REFERENCE.md)** - API documentation *(planned)*

### Project Management
- **[Roadmap](ROADMAP.md)** - Future plans and priorities
- **[Changelog](CHANGELOG.md)** - Version history
- **[Implementation Status](IMPLEMENTATION_STATUS.md)** - Current progress

---

## 🤝 Contributing

We welcome contributions! FlashFusion is in active development and needs help in several areas:

### Priority Areas
1. **Performance Optimization** - Reduce bundle size, improve load times
2. **AI Integration** - Implement real AI features (OpenAI, Anthropic)
3. **Testing** - Increase test coverage from 15% to 60%+
4. **Accessibility** - WCAG 2.1 AA compliance
5. **Documentation** - User guides, API docs

### How to Contribute

1. Check [open issues](https://github.com/Krosebrook/Flashfusionwebsitev20/issues)
2. Comment on an issue you'd like to work on
3. Fork the repository
4. Create a feature branch
5. Make your changes (follow [Guidelines.md](Guidelines.md))
6. Write/update tests
7. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Support & Community

### Get Help
- 📖 **Documentation:** Check `/docs` directory
- 🐛 **Issues:** [GitHub Issues](https://github.com/Krosebrook/Flashfusionwebsitev20/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Krosebrook/Flashfusionwebsitev20/discussions) *(if enabled)*

### Report a Bug
1. Check if the bug is already reported
2. Create a [new issue](https://github.com/Krosebrook/Flashfusionwebsitev20/issues/new) with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

### Request a Feature
1. Check existing feature requests
2. Create an issue with the `enhancement` label
3. Describe the feature and its value
4. Consider contributing the feature yourself!

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Vite](https://vitejs.dev) - Build tool
- [Supabase](https://supabase.com) - Backend platform
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Radix UI](https://www.radix-ui.com) - Accessible components
- [Motion](https://motion.dev) - Animation library
- [Lucide](https://lucide.dev) - Icon library

Special thanks to the open-source community!

---

## 📈 Project Metrics

### Development Status
- **Lines of Code:** ~50,000+
- **Components:** 200+
- **Test Coverage:** ~15% (target: 60%+)
- **Bundle Size:** ~800KB (target: <500KB)
- **Lighthouse Score:** ~70 (target: >90)

### Repository
- **GitHub:** [Krosebrook/Flashfusionwebsitev20](https://github.com/Krosebrook/Flashfusionwebsitev20)
- **Last Updated:** January 13, 2026
- **Active Development:** Yes ✅
- **Open to Contributions:** Yes ✅

---

<div align="center">
  <p><strong>Made with ❤️ by the FlashFusion team</strong></p>
  <p>
    <a href="https://github.com/Krosebrook/Flashfusionwebsitev20">⭐ Star on GitHub</a> •
    <a href="https://github.com/Krosebrook/Flashfusionwebsitev20/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Krosebrook/Flashfusionwebsitev20/issues">💡 Request Feature</a>
  </p>
  <p><em>Building the future of AI-assisted development, one commit at a time.</em></p>
</div>