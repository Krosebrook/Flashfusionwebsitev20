# Testing Guide

**Comprehensive testing guidelines for FlashFusion**

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Stack](#testing-stack)
3. [Test Types](#test-types)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [Testing Best Practices](#testing-best-practices)
7. [Continuous Integration](#continuous-integration)
8. [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

FlashFusion follows a comprehensive testing strategy:

- **Write tests for all new features**: Ensure reliability
- **Test-driven development**: Write tests before code when possible
- **Automated testing**: Run tests in CI/CD pipeline
- **Quality over quantity**: Focus on meaningful tests
- **Fast feedback**: Keep tests quick and focused

### Testing Pyramid

```
        ┌─────────────┐
        │     E2E     │  ← Few, slow, expensive
        │   (10%)     │
        └─────────────┘
      ┌───────────────┐
      │  Integration  │    ← Some, medium speed
      │    (30%)      │
      └───────────────┘
    ┌─────────────────┐
    │   Unit Tests    │      ← Many, fast, cheap
    │     (60%)       │
    └─────────────────┘
```

---

## Testing Stack

### Core Testing Tools

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Vitest** | Unit testing framework | [vitest.dev](https://vitest.dev/) |
| **React Testing Library** | Component testing | [testing-library.com](https://testing-library.com/) |
| **@testing-library/jest-dom** | DOM matchers | [jest-dom](https://github.com/testing-library/jest-dom) |
| **@testing-library/user-event** | User interactions | [user-event](https://testing-library.com/docs/user-event/intro/) |

### Additional Tools

- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: E2E testing (optional)
- **Storybook**: Component development and testing

---

## Test Types

### 1. Unit Tests

Test individual functions, components, or modules in isolation.

**What to test:**
- Utility functions
- Custom hooks
- Business logic
- Data transformations

**Example:**

```typescript
// utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats date in short format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'short')).toBe('01/15/2024');
  });

  it('formats date in long format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'long')).toBe('January 15, 2024');
  });

  it('handles invalid dates', () => {
    expect(() => formatDate(null as any)).toThrow();
  });
});
```

### 2. Component Tests

Test React components with user interactions.

**What to test:**
- Component rendering
- User interactions
- Props handling
- State changes
- Event handlers

**Example:**

```typescript
// components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('ff-btn-secondary');
  });
});
```

### 3. Integration Tests

Test how multiple components or modules work together.

**What to test:**
- Feature workflows
- Component integration
- API integration
- State management

**Example:**

```typescript
// features/AITools.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AITools } from './AITools';
import { mockSupabaseClient } from '../test-utils/mocks';

describe('AITools Integration', () => {
  it('loads and displays AI tools', async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Code Generator', category: 'Development' },
          { id: 2, name: 'Content Writer', category: 'Content' }
        ],
        error: null
      })
    });

    render(<AITools />);

    await waitFor(() => {
      expect(screen.getByText('Code Generator')).toBeInTheDocument();
      expect(screen.getByText('Content Writer')).toBeInTheDocument();
    });
  });
});
```

### 4. End-to-End (E2E) Tests

Test complete user workflows from start to finish.

**What to test:**
- Critical user journeys
- Authentication flows
- Complete feature workflows
- Cross-browser compatibility

**Example with Playwright:**

```typescript
// e2e/user-authentication.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and log in', async ({ page }) => {
  // Navigate to sign up
  await page.goto('/signup');
  
  // Fill sign up form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.click('button[type="submit"]');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --grep="Button"
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report (opens in browser)
open coverage/index.html
```

### Test Configuration

Tests are configured in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/test-utils/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}'
      ]
    }
  }
});
```

---

## Writing Tests

### Test Structure

Follow the AAA pattern: **Arrange, Act, Assert**

```typescript
describe('Feature', () => {
  it('does something specific', () => {
    // Arrange: Set up test data and conditions
    const input = 'test input';
    const expected = 'expected output';
    
    // Act: Execute the code being tested
    const result = functionUnderTest(input);
    
    // Assert: Verify the results
    expect(result).toBe(expected);
  });
});
```

### Testing Custom Hooks

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Mocking

#### Mocking Functions

```typescript
import { vi } from 'vitest';

// Create a mock function
const mockCallback = vi.fn();

// Test that it was called
expect(mockCallback).toHaveBeenCalled();
expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockCallback).toHaveBeenCalledTimes(2);
```

#### Mocking Modules

```typescript
// Mock external dependencies
vi.mock('supabase', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn()
    }
  }))
}));
```

#### Mocking API Calls

```typescript
// Using MSW for API mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/tools', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Tool 1' },
      { id: 2, name: 'Tool 2' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Testing Async Code

```typescript
it('handles async operations', async () => {
  // Using async/await
  const result = await fetchData();
  expect(result).toBeDefined();
  
  // Using waitFor for React components
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing internal state

```typescript
it('sets loading state', () => {
  const component = render(<Component />);
  expect(component.state.isLoading).toBe(true); // Don't do this
});
```

✅ **Good**: Testing user-visible behavior

```typescript
it('shows loading indicator', () => {
  render(<Component />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### 2. Use Descriptive Test Names

❌ **Bad**: Vague test names

```typescript
it('works', () => { /* ... */ });
it('test 1', () => { /* ... */ });
```

✅ **Good**: Clear, specific test names

```typescript
it('displays error message when API call fails', () => { /* ... */ });
it('disables submit button when form is invalid', () => { /* ... */ });
```

### 3. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

```typescript
// Use beforeEach for setup
beforeEach(() => {
  // Reset state
  cleanup();
  // Setup fresh test data
});
```

### 4. Test Edge Cases

```typescript
describe('validateEmail', () => {
  it('validates correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  
  // Edge cases
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
  
  it('rejects email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });
  
  it('rejects email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });
});
```

### 5. Use Test Utilities

Create reusable test utilities:

```typescript
// test-utils/render.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';

export function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
}
```

---

## Continuous Integration

### GitHub Actions

Tests run automatically on every push and pull request:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Coverage Requirements

Maintain test coverage above:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

---

## Troubleshooting

### Common Issues

#### Tests Timing Out

```typescript
// Increase timeout for slow tests
it('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### Cleanup Warnings

```typescript
// Properly cleanup after tests
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

#### Flaky Tests

- Avoid relying on timing (use `waitFor` instead of `setTimeout`)
- Mock external dependencies
- Ensure tests are independent
- Use proper async/await patterns

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk ./node_modules/.bin/vitest --run

# Use debugger statements
it('debugs test', () => {
  debugger; // Pause here when debugging
  // ...
});
```

---

## Related Documentation

- [Contributing Guide](src/CONTRIBUTING.md)
- [Development Workflow](src/DEVELOPMENT_WORKFLOW.md)
- [Code Architecture](src/docs/CODE_ARCHITECTURE.md)
- [Workflow Testing Guide](src/WORKFLOW_TESTING_EXECUTION_GUIDE.md)

---

**Last Updated**: January 2026  
**Testing Guide Version**: 1.0
