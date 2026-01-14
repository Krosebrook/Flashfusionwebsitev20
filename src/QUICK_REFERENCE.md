# FlashFusion Quick Reference Guide

**Version:** 2.1.0 | **Updated:** January 13, 2026

---

## 📚 Documentation Index

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[README.md](README.md)** | Main entry point | First-time visitors, overview |
| **[CHANGELOG.md](CHANGELOG.md)** | Version history | Check what changed in releases |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Technical architecture | Understanding system design |
| **[ROADMAP.md](ROADMAP.md)** | Future plans | See what's coming next |
| **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** | Current progress | Know what's complete vs planned |
| **[Guidelines.md](Guidelines.md)** | Design system | Building UI components |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How to contribute | Before submitting PRs |

---

## 🎯 Current Status at a Glance

**Version:** 2.1.0 (Beta)  
**Completion:** ~35-40% production-ready  
**Phase:** Stabilization (Q1 2026)

### ✅ What Works
- Authentication (email, OAuth)
- UI components (50+)
- Landing page
- Basic dashboard
- Routing & navigation

### ⚠️ In Development
- AI code generator
- Workflow builder
- Real analytics
- Performance optimization

### 🔴 Priority Issues
- Bundle size (~800KB → target <500KB)
- Test coverage (15% → target 60%+)
- Accessibility gaps
- Placeholder AI features

---

## 🚀 Quick Commands

### Development
```bash
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview build
```

### Code Quality
```bash
npm run lint            # Check linting
npm run lint:fix        # Auto-fix issues
npm run format          # Format code
npm run type-check      # TypeScript check
```

### Testing
```bash
npm run test           # Watch mode
npm run test:run       # Run once
npm run test:ci        # With coverage
```

---

## 📊 Key Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle Size | ~800KB | <500KB | 🔴 Critical |
| Load Time | 3-5s | <2s | 🔴 Critical |
| Test Coverage | ~15% | 60%+ | 🔴 Critical |
| Lighthouse | ~70 | >90 | 🟡 High |
| Accessibility | ~40% | 100% | 🟡 High |
| Mobile UX | ~55% | >85% | 🟡 High |

---

## 🗺️ Roadmap Summary

### Q1 2026 - Stabilization (Current)
- ⚡ Performance optimization
- 🎯 Feature consolidation (60+ → 5 core)
- ♿ Accessibility compliance
- 📱 Mobile improvements

### Q2 2026 - Migration
- 🏗️ Next.js 14+ migration
- 🔧 Backend restructuring
- 🧪 Testing infrastructure

### Q3 2026 - AI Features
- 🤖 Real AI integrations
- 🔄 Workflow engine
- 📊 Analytics platform

### Q4 2026 - Enterprise
- 👥 Team collaboration
- 🔐 SSO & security
- 🚀 Scalability

---

## 🏗️ Architecture Quick View

```
Client (React 18 + TypeScript)
    ↓
API Gateway (Supabase Edge Functions + Hono)
    ↓
Services (AI, Content, Deploy, Analytics)
    ↓
Data (PostgreSQL, Storage, Realtime)
    ↓
External (OpenAI, GitHub, Vercel)
```

---

## 🔑 Environment Variables

### Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Optional (Backend)
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Get credentials:** [Supabase Dashboard](https://app.supabase.com) → Settings → API

---

## 🎨 Design System Quick Guide

### Colors
```css
--ff-primary: #FF7B00      /* Orange */
--ff-secondary: #00B4D8    /* Cyan */
--ff-accent: #E91E63       /* Magenta */
--ff-bg-dark: #0F172A      /* Navy */
--ff-surface: #1E293B      /* Slate */
```

### Fonts
- **Headings:** Sora
- **Body:** Inter
- **Code:** JetBrains Mono

### Component Classes
```tsx
className="ff-btn-primary"        // Primary button
className="ff-card-interactive"   // Hover card
className="ff-fade-in-up"         // Animation
```

---

## 🐛 Common Issues & Fixes

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Type Errors
```bash
# Regenerate TypeScript types
npm run type-check
```

### Supabase Connection Error
1. Check `.env.local` exists
2. Verify credentials at Supabase dashboard
3. Ensure `VITE_` prefix for frontend vars

### Hot Reload Not Working
```bash
# Restart dev server
npm run dev
```

---

## 📝 Git Workflow

### Branch Naming
```bash
feature/ai-code-generator
fix/auth-redirect-bug
docs/update-readme
refactor/simplify-navigation
```

### Commit Messages
```bash
feat: add AI code generator
fix: resolve auth redirect loop
docs: update README with status
style: format code with Prettier
refactor: simplify navigation logic
test: add auth flow tests
chore: update dependencies
```

Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎯 Priority Tasks (Week by Week)

### Week 1-2: Performance
- [ ] Remove unused dependencies
- [ ] Implement code splitting
- [ ] Add React.memo to components
- [ ] Optimize images

### Week 3-4: Simplification
- [ ] Remove placeholder tools
- [ ] Keep 5 core features
- [ ] Simplify navigation
- [ ] Update landing page

### Week 5-6: Accessibility
- [ ] Add ARIA labels
- [ ] Keyboard navigation
- [ ] Fix color contrast
- [ ] Screen reader testing

### Week 7-8: Mobile
- [ ] Fix responsive layouts
- [ ] Increase touch targets
- [ ] Optimize performance
- [ ] Test on devices

---

## 🤝 Contributing Quick Start

1. **Find an issue** on GitHub
2. **Fork** repository
3. **Create branch** (`feature/your-feature`)
4. **Make changes** (follow Guidelines.md)
5. **Write tests**
6. **Submit PR**

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📞 Getting Help

- 📖 **Docs:** Check `/docs` folder
- 🐛 **Issues:** [GitHub Issues](https://github.com/Krosebrook/Flashfusionwebsitev20/issues)
- 💬 **Questions:** Create a discussion

---

## 🔗 Important Links

- **Repository:** [github.com/Krosebrook/Flashfusionwebsitev20](https://github.com/Krosebrook/Flashfusionwebsitev20)
- **Supabase:** [app.supabase.com](https://app.supabase.com)
- **Figma Make:** [figma.com/make](https://www.figma.com/make)

---

## 📚 Learning Resources

### FlashFusion
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [Guidelines.md](Guidelines.md) - Design system
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - What's complete

### Technologies
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives)

---

## 🎓 Tips for New Contributors

1. **Read ARCHITECTURE.md first** - Understand the system
2. **Start small** - Fix a bug or improve docs
3. **Follow Guidelines.md** - Consistent code style
4. **Write tests** - Increase coverage
5. **Ask questions** - Use GitHub Discussions

---

**Last Updated:** January 13, 2026  
**Next Review:** February 1, 2026  
**Maintainer:** Engineering Team
