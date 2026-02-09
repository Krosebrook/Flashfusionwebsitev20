# FlashFusion Copilot Instructions

Welcome to the FlashFusion AI Development Platform repository. These instructions help GitHub Copilot agents understand the codebase and provide better assistance.

## Repository Overview

**FlashFusion** is an AI-powered development platform built with React 18, TypeScript, Vite, and Supabase. It provides code generation, project management, and deployment automation with a focus on developer experience and performance.

### Key Technologies

- **Frontend**: React 18.3.1, TypeScript 5.x, Vite 6.3.5
- **UI Library**: Radix UI primitives with custom FlashFusion design system
- **Styling**: Tailwind CSS v4 with CSS variables
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Forms**: React Hook Form 7.55.0 + Zod validation
- **Testing**: Vitest + React Testing Library
- **Build**: Vite with SWC for fast compilation

## Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── ui/             # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── auth/           # Authentication components
│   ├── ai/             # AI-related components
│   ├── analytics/      # Analytics and dashboards
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Core utilities and configurations
│   ├── supabase.ts    # Supabase client and database types
│   └── config.ts      # Environment configuration
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── api/                # API client code
└── test/               # Test utilities and setup
```

## Development Workflow

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Build Commands

- `npm run dev` - Start Vite dev server on port 3000
- `npm run build` - Build for production (output: `build/`)

## Code Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.tsx`, `CodeGenerator.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`, `useProjects.ts`)
- **Utilities**: kebab-case (e.g., `app-constants.ts`, `file-generators.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserRow`, `ProjectConfig`)
- **Test files**: `ComponentName.test.tsx` in `__tests__/` subdirectories

### Import Conventions

Use path alias `@/` for imports:

```typescript
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
```

### File Organization

- Place tests in `__tests__/` subdirectories next to the code they test
- Group related components in feature directories
- Keep UI primitives in `src/components/ui/`
- Extract reusable logic into custom hooks in `src/hooks/`

## FlashFusion Design System

### CRITICAL: Always use FlashFusion design classes

#### Typography
- Headings: `font-sora` + `ff-text-{size}`
- Body text: `font-inter` + `ff-text-{size}`
- Buttons: `font-sora`

#### Animations
- Entry: `ff-fade-in-up`, `ff-stagger-fade`
- Hover: `ff-hover-glow`, `ff-hover-lift`, `ff-hover-scale`
- Progress: `ff-pulse-glow`

#### Buttons
- Primary: `ff-btn-primary`
- Secondary: `ff-btn-secondary`
- Accent: `ff-btn-accent`

#### Cards
- Interactive: `ff-card-interactive`
- With hover: `ff-hover-lift`

#### Focus
- All interactive elements: `ff-focus-ring`

### Example Component

```typescript
<Card className="ff-card-interactive ff-hover-lift">
  <CardHeader>
    <CardTitle className="font-sora ff-text-2xl ff-text-gradient">
      AI Code Generator
    </CardTitle>
  </CardHeader>
  <CardContent className="ff-fade-in-up">
    <Button className="ff-btn-primary font-sora ff-hover-glow ff-focus-ring">
      Generate Code
    </Button>
  </CardContent>
</Card>
```

## TypeScript Guidelines

- **Strict mode enabled** - No implicit `any` types
- Always define interfaces for component props
- Use type inference from Zod schemas: `type FormData = z.infer<typeof schema>`
- Import database types from `@/lib/supabase`:
  ```typescript
  import type { UserRow, ProjectRow } from '@/lib/supabase';
  ```

## Supabase Integration

### Client Usage

```typescript
import { supabase } from '@/lib/supabase';

// Queries
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId);

// Always handle errors
if (error) {
  throw new Error(`Database error: ${error.message}`);
}
```

### Database Types

All database types are defined in `src/lib/supabase.ts`. Main tables:
- `users` - User profiles
- `projects` - User projects
- `user_stats` - Gamification stats
- `deployments` - Deployment tracking
- `integrations` - Third-party services

### Row Level Security

All tables use RLS. Queries automatically filter based on authenticated user.

## Testing

### Test Framework

- **Test Runner**: Vitest with `globals: true`
- **UI Testing**: React Testing Library
- **Setup**: `src/test/setup.ts`
- **Config**: `src/vitest.config.ts`

### Test Patterns

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Error Handling

- Use `ErrorBoundary` from `src/components/ErrorBoundary.tsx`
- Always wrap async operations in try-catch
- Log errors with context for debugging
- Display user-friendly error messages

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('User-friendly message');
}
```

## Performance

- Use React.memo for expensive components
- Implement code splitting with `React.lazy()` for routes
- Use `useMemo` and `useCallback` appropriately
- Virtualize long lists with `VirtualScrollList` component

## Accessibility

- All interactive elements must have `ff-focus-ring`
- Use semantic HTML (`button`, `nav`, `main`, etc.)
- Add ARIA attributes (`aria-label`, `aria-describedby`)
- Test keyboard navigation (Tab, Enter, Escape)

## Security

- Never hardcode API keys - use `import.meta.env.VITE_*`
- Validate all user input with Zod schemas
- Use Supabase RLS for data access control
- Sanitize HTML if using `dangerouslySetInnerHTML`

## Custom Agents

This repository has specialized agents in `.github/agents/`:

1. **FlashFusion UI Component Builder** - Create Radix UI components with design system
2. **TypeScript Type Safety** - Strengthen types, remove `any`
3. **Vitest Test Writer** - Write comprehensive tests
4. **Supabase Integration** - Database queries and auth
5. **FlashFusion Design System** - Ensure design compliance
6. **React Performance Optimizer** - Optimize rendering
7. **Documentation Writer** - JSDoc and README files
8. **React Custom Hook Creator** - Create reusable hooks
9. **Error Handling & ErrorBoundary** - Robust error handling
10. **Form Management & Validation** - React Hook Form + Zod
11. **Accessibility & ARIA** - WCAG 2.1 Level AA compliance
12. **Security Auditor** - Find and fix vulnerabilities
13. **CI/CD & Build** - Vite builds and deployment

Use these agents by mentioning them in your requests.

## Common Tasks

### Add a new component
1. Create file in appropriate `src/components/[feature]/` directory
2. Use FlashFusion design system classes
3. Add TypeScript interfaces for props
4. Include JSDoc comments
5. Create test file in `__tests__/` subdirectory
6. Use existing UI primitives from `src/components/ui/`

### Add a new page
1. Create component in `src/components/pages/`
2. Add lazy loading in routing
3. Wrap in Suspense with LoadingState
4. Add to route configuration

### Add a new hook
1. Create file in `src/hooks/useHookName.ts`
2. Start function name with "use"
3. Add TypeScript return type
4. Document with JSDoc
5. Create test with `renderHook`

### Add database query
1. Import types from `@/lib/supabase`
2. Use Supabase client from `@/lib/supabase`
3. Add error handling
4. Filter by user_id for user data
5. Type the response data

## Anti-Patterns to Avoid

1. ❌ Using generic Tailwind classes instead of `ff-*` classes
2. ❌ Skipping `font-sora` on headings/buttons
3. ❌ Using `any` type instead of proper TypeScript types
4. ❌ Forgetting `ff-focus-ring` on interactive elements
5. ❌ Not handling Supabase errors
6. ❌ Hardcoding API keys or secrets
7. ❌ Creating components without accessibility attributes
8. ❌ Skipping tests for new features

## Getting Help

- Read agent instructions in `.github/agents/`
- Check existing components for patterns
- Review `FLASHFUSION_STYLING_GUIDE.md` for design system
- See `CONTRIBUTING.md` for contribution guidelines
- Test locally with `npm run dev`

## Environment Variables

Required for development:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Demo mode works without these for testing UI.

## Summary

When working on FlashFusion:
1. Follow FlashFusion design system (ff-* classes)
2. Use TypeScript strict mode
3. Test with Vitest + React Testing Library
4. Integrate with Supabase following patterns
5. Ensure accessibility (ARIA, keyboard nav)
6. Handle errors comprehensively
7. Optimize performance
8. Write documentation
9. Follow security best practices
10. Use specialized agents for specific tasks
