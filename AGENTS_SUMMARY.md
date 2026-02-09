# FlashFusion Custom Agents - Quick Reference

This repository now has 13 specialized coding agents to assist with development. Each agent is an expert in a specific domain and understands FlashFusion's unique architecture, patterns, and conventions.

## 🎯 Quick Agent Selection Guide

### Building UI Components
→ **FlashFusion UI Component Builder** (`flashfusion-ui-component-builder.agent.md`)
- Creates React components with Radix UI + FlashFusion design system
- Enforces ff-* styling classes, accessibility, TypeScript

### Making Components Look Right
→ **FlashFusion Design System Compliance** (`flashfusion-design-system.agent.md`)
- Ensures proper typography (font-sora, font-inter)
- Applies correct animations (ff-fade-in-up, ff-hover-glow)
- Validates color contrast and responsive design

### Adding Database Features
→ **Supabase Integration** (`supabase-integration.agent.md`)
- Implements queries, auth flows, real-time subscriptions
- Handles RLS, error handling, demo mode

### Writing Tests
→ **Vitest Test Writer** (`vitest-test-writer.agent.md`)
- Creates comprehensive tests with Vitest + React Testing Library
- Mocks Supabase correctly
- Follows existing test patterns

### Fixing Type Errors
→ **TypeScript Type Safety** (`typescript-type-safety.agent.md`)
- Removes `any` types
- Creates proper interfaces
- Uses Supabase database types

### Creating Forms
→ **Form Management & Validation** (`form-management-validation.agent.md`)
- React Hook Form + Zod validation
- Proper error handling and UX
- Multi-step forms

### Making Accessible
→ **Accessibility & ARIA** (`accessibility-aria.agent.md`)
- ARIA attributes, keyboard navigation
- WCAG 2.1 Level AA compliance
- Screen reader support

### Improving Performance
→ **React Performance Optimizer** (`react-performance-optimizer.agent.md`)
- Memoization (React.memo, useMemo, useCallback)
- Code splitting, lazy loading
- Virtualization for long lists

### Handling Errors
→ **Error Handling & ErrorBoundary** (`error-handling-errorboundary.agent.md`)
- ErrorBoundary implementation
- Async error handling
- User-friendly error states

### Creating Reusable Logic
→ **React Custom Hook Creator** (`react-custom-hook-creator.agent.md`)
- Custom hooks for data fetching, state management
- Proper TypeScript typing
- Cleanup and side effects

### Security Review
→ **Security Auditor** (`security-auditor.agent.md`)
- XSS prevention
- Auth/authorization checks
- RLS verification
- Secret management

### Writing Documentation
→ **Documentation Writer** (`documentation-writer.agent.md`)
- JSDoc comments
- README files
- API documentation
- Usage examples

### Build & Deploy Issues
→ **CI/CD & Build** (`cicd-build.agent.md`)
- Vite optimization
- GitHub Actions
- Vercel/Netlify config
- Troubleshooting builds

## 📋 Common Workflows

### Creating a New Feature
1. Use **FlashFusion UI Component Builder** to create components
2. Use **Supabase Integration** for database operations
3. Use **Vitest Test Writer** to add tests
4. Use **Documentation Writer** for JSDoc comments
5. Use **Security Auditor** to review before merge

### Fixing Bugs
1. Use **TypeScript Type Safety** to fix type errors
2. Use **Error Handling** to improve error states
3. Use **Vitest Test Writer** to add regression tests
4. Use **Accessibility** if it's a UI bug

### Performance Issues
1. Use **React Performance Optimizer** to identify bottlenecks
2. Use **CI/CD & Build** to optimize bundle size
3. Use **Vitest Test Writer** to add performance tests

### Accessibility Audit
1. Use **Accessibility & ARIA** to audit components
2. Use **FlashFusion Design System** to fix styling
3. Use **FlashFusion UI Component Builder** to rebuild if needed

## 🎨 FlashFusion Design System Quick Reference

All agents enforce these patterns:

### Typography
```tsx
<h1 className="font-sora ff-text-3xl ff-text-gradient">Heading</h1>
<p className="font-inter ff-text-base">Body text</p>
<Button className="ff-btn-primary font-sora">Click</Button>
```

### Animations
```tsx
<div className="ff-fade-in-up">Fades in from bottom</div>
<Card className="ff-card-interactive ff-hover-lift">Lifts on hover</Card>
<Button className="ff-hover-glow">Glows on hover</Button>
```

### Accessibility
```tsx
<Button className="ff-focus-ring" aria-label="Close">X</Button>
<Input className="ff-focus-ring" aria-invalid={!!error} />
```

## 🔗 Key File Locations

- **Agents**: `.github/agents/*.agent.md`
- **Setup**: `.github/copilot-instructions.md`
- **CI/CD**: `.github/copilot-setup-steps.yml`
- **Components**: `src/components/`
- **Hooks**: `src/hooks/`
- **Supabase**: `src/lib/supabase.ts`
- **Tests**: `src/components/**/__tests__/`
- **Design Guide**: `src/FLASHFUSION_STYLING_GUIDE.md`

## 💡 Tips

1. **Be specific**: Mention the agent you want to use
2. **Provide context**: Include relevant file paths and code
3. **Ask for examples**: Agents provide comprehensive examples
4. **Review output**: Agents follow patterns but verify the code
5. **Iterate**: Refine your request based on agent responses

## 📞 Getting Help

- Read agent files in `.github/agents/`
- Check `.github/copilot-instructions.md` for conventions
- Review existing components for patterns
- Test locally with `npm run dev`

---

**Created**: 2026-02-09
**Repository**: Krosebrook/Flashfusionwebsitev20
**Total Agents**: 13
