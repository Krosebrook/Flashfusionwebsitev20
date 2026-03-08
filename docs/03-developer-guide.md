# Developer Guide

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers

---

## Table of Contents

1. [Coding Conventions](#1-coding-conventions)
2. [TypeScript Patterns](#2-typescript-patterns)
3. [React Component Patterns](#3-react-component-patterns)
4. [State Management Patterns](#4-state-management-patterns)
5. [File & Folder Conventions](#5-file--folder-conventions)
6. [Styling Guidelines](#6-styling-guidelines)
7. [Events & Custom Hooks](#7-events--custom-hooks)
8. [Error Handling](#8-error-handling)
9. [Logging & Telemetry](#9-logging--telemetry)
10. [Code Review Checklist](#10-code-review-checklist)
11. [Git Workflow](#11-git-workflow)
12. [Dependency Management](#12-dependency-management)

---

## 1. Coding Conventions

### General Rules

| Rule | Rationale |
|---|---|
| Use TypeScript strict mode (`"strict": true` in `tsconfig.json`) | Catches null/undefined bugs at compile time |
| Prefer `const` over `let`; avoid `var` | Reduces accidental mutation |
| Avoid `any` type; use `unknown` + narrowing if needed | Preserves type safety |
| One component / export per file | Improves tree-shaking and discoverability |
| Keep functions ≤ 40 lines; extract helpers if longer | Improves readability and testability |
| Write self-documenting names; add comments only for non-obvious logic | Reduces maintenance overhead |
| No console.log in production code; use the telemetry helpers | Avoids log noise in production |

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| React components | `PascalCase` | `UserProfileCard` |
| Files (components) | `PascalCase.tsx` | `UserProfileCard.tsx` |
| Files (utilities/hooks) | `camelCase.ts` | `useAuthSession.ts` |
| Directories | `kebab-case` | `user-profile/` |
| Variables / functions | `camelCase` | `getUserData` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| TypeScript interfaces | `PascalCase` (no `I` prefix) | `UserProfile` |
| TypeScript types | `PascalCase` | `AuthState` |
| CSS variables | `--flashfusion-<token>` | `--flashfusion-primary` |
| Supabase table names | `snake_case` | `user_projects` |

---

## 2. TypeScript Patterns

### Props Interfaces

```typescript
// ✅ Good — explicit interface, co-located with component
interface UserCardProps {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  onSelect?: (userId: string) => void;
}

export function UserCard({ userId, displayName, avatarUrl, onSelect }: UserCardProps) {
  // ...
}
```

### Discriminated Unions for State

```typescript
// ✅ Good — exhaustive state modelling
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

### Zod Schema Validation

```typescript
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']),
});

type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
```

---

## 3. React Component Patterns

### Functional Components (Required)

```typescript
// ✅ Functional component with typed props
export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-lg border p-4">
      {icon}
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
```

### Composition over Inheritance

Prefer composing small, focused components over large monolithic ones.

```typescript
// ✅ Composed from primitives
function DashboardCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

### Lazy Loading for Route-Level Components

```typescript
// ✅ Reduces initial bundle size
const DashboardPage = React.lazy(() => import('./components/pages/DashboardPage'));
```

### Accessibility Requirements

- All interactive elements must be reachable via keyboard.
- Use Radix UI primitives for dialogs, menus, tooltips — they handle ARIA automatically.
- Images must have meaningful `alt` text or `alt=""` for decorative images.
- Colour contrast must meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text).

---

## 4. State Management Patterns

### Local State

Use `useState` for UI-specific, non-shared state.

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Derived State

Compute derived values with `useMemo`; avoid storing derived data in state.

```typescript
// ✅ Derived, not stored
const filteredItems = useMemo(
  () => items.filter(item => item.status === activeFilter),
  [items, activeFilter]
);
```

### Context (Global Cross-Cutting State Only)

Reserve Context for: auth session, theme, feature flags, notifications.

```typescript
// ✅ Focused context
const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

### Supabase Data Fetching

```typescript
// ✅ Custom hook encapsulates data fetching
function useUserProjects(userId: string) {
  const [state, setState] = useState<FetchState<Project[]>>({ status: 'idle' });

  useEffect(() => {
    setState({ status: 'loading' });
    supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) setState({ status: 'error', error: new Error(error.message) });
        else setState({ status: 'success', data: data ?? [] });
      });
  }, [userId]);

  return state;
}
```

---

## 5. File & Folder Conventions

```
src/components/
├── core/         # App shell, routing, system initialisation
├── layout/       # Persistent chrome (header, footer, nav)
├── pages/        # One file per route — named after the route
├── ui/           # Shared shadcn/ui primitive wrappers
├── automation/   # Workflow automation feature
├── testing/      # QA / regression feature
├── providers/    # React context provider files
├── hooks/        # Shared custom hooks (outside components/ by convention)
├── lib/          # Pure utilities (no React imports)
└── [feature]/    # New features get their own directory
```

**Rule:** Feature directories live under `src/components/[feature-name]/`.  
**Rule:** Shared utilities that have no React dependency go in `src/lib/`.  
**Rule:** All custom hooks (that use React APIs) go in `src/hooks/` or co-located with their feature.

---

## 6. Styling Guidelines

- Use **Tailwind CSS utility classes** as the primary styling mechanism.
- Use **CSS variables** (`--flashfusion-*`) for brand tokens to support theming.
- Use the `cn()` utility (`src/lib/utils.ts`) to merge conditional classes.
- Do **not** use inline `style` attributes except for truly dynamic values (e.g., animation transforms).
- Avoid writing custom CSS unless Tailwind cannot achieve the desired result.

```typescript
// ✅ Conditional classes via cn()
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-md px-4 py-2',
  isActive && 'bg-primary text-primary-foreground',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />
```

### Dark Mode

All colour tokens must have dark-mode variants defined in `globals.css`.

```css
:root { --flashfusion-background: 0 0% 100%; }
.dark { --flashfusion-background: 222.2 84% 4.9%; }
```

---

## 7. Events & Custom Hooks

### Custom Hook Rules

- Name hooks with the `use` prefix: `useDebounce`, `useLocalStorage`.
- Hooks must be pure in terms of side effects — declare all side effects explicitly in `useEffect`.
- Return descriptive named values, not positional arrays (prefer objects).

```typescript
// ✅ Descriptive return object
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return { value, toggle, setTrue: () => setValue(true), setFalse: () => setValue(false) };
}
```

### Event Handler Naming

- Prop callbacks: `onEventName` (e.g., `onSubmit`, `onSelect`, `onClose`)
- Handler functions inside component: `handleEventName` (e.g., `handleSubmit`)

---

## 8. Error Handling

### Error Boundaries

Wrap feature areas with `ErrorBoundaryEnhanced` to prevent full-page crashes.

```typescript
<ErrorBoundaryEnhanced fallback={<FeatureErrorFallback />}>
  <ComplexFeatureComponent />
</ErrorBoundaryEnhanced>
```

### Async Error Handling

Always handle promise rejections; do not rely on unhandled-promise-rejection events.

```typescript
// ✅ Explicit error handling
try {
  const { data, error } = await supabase.from('projects').select();
  if (error) throw new Error(error.message);
  return data;
} catch (err) {
  reportError(err); // telemetry helper
  throw err;        // re-throw for boundary or caller
}
```

---

## 9. Logging & Telemetry

| Environment | Behaviour |
|---|---|
| Development | `console.warn` / `console.error` permitted for debug output |
| Production | Use `reportError(err)` (Sentry wrapper) for exceptions; no `console.log` |

```typescript
// src/lib/telemetry.ts  (pattern)
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    // Sentry.captureException(error, { extra: context });
  } else {
    console.error('[FlashFusion Error]', error, context);
  }
}
```

---

## 10. Code Review Checklist

Before requesting a review, self-review against this checklist:

### Correctness
- [ ] Feature works as specified in the linked issue
- [ ] Edge cases handled (empty states, loading states, error states)
- [ ] No regressions in related features

### Code Quality
- [ ] TypeScript strict — no `any`, no `ts-ignore` without explanation
- [ ] No `console.log` left in code
- [ ] Functions ≤ 40 lines; complex logic extracted
- [ ] No commented-out code blocks

### Testing
- [ ] Unit tests added/updated for new logic
- [ ] Existing tests still pass (`npm test` green)
- [ ] Edge cases covered in tests

### Security
- [ ] No secrets, API keys, or credentials in code
- [ ] User input validated with Zod before processing
- [ ] Supabase queries use RLS (no `service_role` key client-side)

### Accessibility
- [ ] Interactive elements are keyboard-accessible
- [ ] `alt` text on all images
- [ ] Colour contrast meets AA standard

### Documentation
- [ ] `README.md` / docs updated if behaviour changed
- [ ] Complex logic has inline comments
- [ ] PR description explains _why_, not just _what_

---

## 11. Git Workflow

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<short-description>` | `feature/ai-tool-gallery` |
| Bug fix | `fix/<short-description>` | `fix/auth-redirect-loop` |
| Hot fix | `hotfix/<short-description>` | `hotfix/broken-build` |
| Chore | `chore/<short-description>` | `chore/update-dependencies` |
| Docs | `docs/<short-description>` | `docs/api-reference-update` |

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: BREAKING CHANGE or issue refs]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Examples:
```
feat(auth): add GitHub OAuth provider
fix(dashboard): resolve chart data not refreshing on filter change
docs(api): update authentication endpoint examples
chore(deps): upgrade lucide-react to 0.487
```

### Pull Request Process

1. Open a PR against `develop` (not `main`) for regular changes.
2. Fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md).
3. Ensure CI passes (build + tests).
4. At least one reviewer approval required before merge.
5. Squash-merge to keep `develop` history clean.

---

## 12. Dependency Management

- Use exact versions for direct dependencies in `package.json` where stability is critical.
- Run `npm audit` before merging dependency updates; address critical/high vulnerabilities.
- Evaluate the bundle impact of new dependencies with `npm run build -- --report`.
- Prefer packages with active maintenance (< 6 months since last release).
- Avoid adding packages that duplicate existing functionality.

---

*Last Updated: 2026-03-08 | Owner: Engineering Team*
