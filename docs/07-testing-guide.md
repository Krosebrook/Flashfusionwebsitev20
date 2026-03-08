# Testing Guide

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers, QA

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Stack](#2-test-stack)
3. [Running Tests](#3-running-tests)
4. [Unit Tests](#4-unit-tests)
5. [Integration Tests](#5-integration-tests)
6. [Component Tests](#6-component-tests)
7. [End-to-End Tests (Planned)](#7-end-to-end-tests-planned)
8. [Coverage Targets](#8-coverage-targets)
9. [Test File Conventions](#9-test-file-conventions)
10. [Mocking Strategy](#10-mocking-strategy)
11. [Testing Checklist](#11-testing-checklist)

---

## 1. Testing Philosophy

- **Test behaviour, not implementation.** Tests should verify what a component or function _does_, not how it does it internally.
- **Prioritise integration over unit tests for UI.** A test that renders a component with real data interactions is more valuable than one that only tests isolated rendering.
- **Tests must be deterministic.** Flaky tests are removed or fixed; they erode trust in the suite.
- **Co-locate test files with source.** Each test file sits next to the file it tests, making them easy to find and maintain.

---

## 2. Test Stack

| Tool | Role | Config |
|---|---|---|
| **Vitest** | Test runner, assertion library | `vite.config.ts` |
| **React Testing Library** | Component rendering and interaction | — |
| **@testing-library/user-event** | Simulating user interactions | — |
| **@testing-library/jest-dom** | Custom DOM matchers (`.toBeInTheDocument()`) | `vitest.setup.ts` |
| **MSW (Mock Service Worker)** | API mocking (planned) | — |

### Vitest Configuration

```typescript
// vite.config.ts (test section)
test: {
  globals: true,              // No need to import describe/it/expect
  environment: 'jsdom',       // DOM APIs available in tests
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    exclude: ['node_modules/', 'src/docs/', 'src/test/'],
  },
}
```

### Setup File

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
// Global test setup goes here (e.g., MSW server start/stop)
```

---

## 3. Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npx vitest run src/components/ui/button.test.tsx

# Run tests matching a pattern
npx vitest run --reporter=verbose -t "should render"
```

---

## 4. Unit Tests

Unit tests cover pure functions, utilities, and custom hooks in isolation.

### Example — Utility Function

```typescript
// src/lib/format-date.ts
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(date);
}
```

```typescript
// src/lib/format-date.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats a date in en-US locale', () => {
    const date = new Date('2026-03-08T00:00:00Z');
    expect(formatDate(date)).toBe('Mar 8, 2026');
  });

  it('accepts a custom locale', () => {
    const date = new Date('2026-03-08T00:00:00Z');
    const result = formatDate(date, 'de-DE');
    expect(result).toContain('2026');
  });
});
```

### Example — Custom Hook

```typescript
// src/hooks/use-toggle.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './use-toggle';

describe('useToggle', () => {
  it('initialises with the provided value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it('toggles the value', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);
  });

  it('sets value to false with setFalse', () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
  });
});
```

---

## 5. Integration Tests

Integration tests verify that components work correctly with their dependencies (context, hooks, data).

### Example — Component with Context

```typescript
// src/components/layout/AppHeader.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppHeader } from './AppHeader';
import { AuthProvider } from '../providers/AuthProvider';

function renderWithAuth(ui: React.ReactElement, { user = null } = {}) {
  // Provide a mock auth context
  return render(
    <AuthProvider initialUser={user}>{ui}</AuthProvider>
  );
}

describe('AppHeader', () => {
  it('shows login button when user is not authenticated', () => {
    renderWithAuth(<AppHeader />);
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows user avatar when authenticated', () => {
    renderWithAuth(<AppHeader />, {
      user: { id: '1', email: 'user@example.com', avatarUrl: null },
    });
    expect(screen.getByRole('img', { name: /user avatar/i })).toBeInTheDocument();
  });
});
```

---

## 6. Component Tests

Component tests focus on a single component's rendering and user interactions without testing full data flows.

### Example — Button Component

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies the destructive variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

---

## 7. End-to-End Tests (Planned)

End-to-end tests using **Playwright** are planned for critical user flows:

- User registration and email verification
- Login with email/password
- Login with GitHub OAuth
- Creating a new project
- Publishing a deployment

### Target Setup

```bash
# Planned — not yet implemented
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/auth.spec.ts (planned)
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 8. Coverage Targets

| Metric | Minimum Target | Notes |
|---|---|---|
| Statement | 70% | Enforced in CI |
| Branch | 60% | Enforced in CI |
| Function | 70% | Enforced in CI |
| Line | 70% | Reported only |

Coverage is measured by Vitest with the `v8` provider. Reports are generated in `coverage/` and uploaded as CI artefacts.

### Files Excluded from Coverage

- `src/docs/**` — documentation
- `src/components/ui/**` — third-party UI primitives (shadcn/ui)
- `*.stories.tsx` — Storybook files
- `*.config.ts` — configuration files

---

## 9. Test File Conventions

| Convention | Example |
|---|---|
| Test file naming | `ComponentName.test.tsx` or `util-name.test.ts` |
| Co-location | Place test file next to source file |
| Test IDs | Prefer `getByRole` > `getByText` > `getByTestId` |
| `data-testid` | Use only when no accessible role/label is available |
| Arrange-Act-Assert | Structure tests in three clear sections |
| One `describe` per file | Group related tests under the component/function name |
| Test isolation | Each test cleans up its state; no test depends on another |

---

## 10. Mocking Strategy

### Supabase Client

```typescript
// src/test/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock('@/lib/supabase', () => ({ supabase: mockSupabase }));
```

### Environment Variables

```typescript
// In test file
vi.stubEnv('VITE_APP_ENV', 'test');
```

### Timers

```typescript
// Use fake timers for debounce/throttle tests
vi.useFakeTimers();
// ... test ...
vi.useRealTimers();
```

---

## 11. Testing Checklist

Before submitting a PR:

- [ ] New utility functions have unit tests
- [ ] New React components have component tests covering: render, user interaction, edge states (loading, error, empty)
- [ ] Changed logic has updated tests
- [ ] `npm test` passes locally
- [ ] Coverage has not decreased from baseline
- [ ] Tests use accessible queries (`getByRole`, `getByLabelText`) where possible
- [ ] No `test.only` or `describe.only` left in the codebase

---

*Last Updated: 2026-03-08 | Owner: Engineering / QA*
