# Unit & Component Test Examples

This file provides reference test structures for FlashFusion. Copy and adapt these patterns for your own tests.

See [Testing Guide](../07-testing-guide.md) for the full testing strategy.

---

## 1. Utility Function Test

```typescript
// src/lib/format-currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  // Happy path — standard input
  it('formats a positive number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  // Edge case — zero
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  // Edge case — negative
  it('formats a negative number', () => {
    expect(formatCurrency(-99.9)).toBe('-$99.90');
  });

  // Parameterised — test multiple inputs efficiently
  it.each([
    [100, '$100.00'],
    [1000, '$1,000.00'],
    [1000000, '$1,000,000.00'],
  ])('formats %d as %s', (input, expected) => {
    expect(formatCurrency(input)).toBe(expected);
  });

  // Error case — invalid input
  it('throws for non-numeric input', () => {
    expect(() => formatCurrency(NaN)).toThrow('Invalid amount');
  });
});
```

---

## 2. Custom Hook Test

```typescript
// src/hooks/use-debounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // Initial value is returned immediately
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  // Value does not change before delay expires
  it('does not update the value before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );
    rerender({ value: 'world' });
    expect(result.current).toBe('hello');
  });

  // Value updates after delay
  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );
    rerender({ value: 'world' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('world');
  });
});
```

---

## 3. React Component Test

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  // Rendering
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Interaction
  it('calls the onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // Accessibility — disabled state
  it('is disabled and cannot be clicked when the disabled prop is set', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Variant
  it('applies the destructive variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  // Loading state
  it('shows a spinner and hides text when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });
});
```

---

## 4. Component with Context / Provider

```typescript
// src/components/layout/UserMenu.test.tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { UserMenu } from './UserMenu';
import { AuthProvider } from '../providers/AuthProvider';

// Helper: render with auth context
function renderAuthenticated(
  ui: React.ReactElement,
  user = { id: '1', email: 'user@example.com', displayName: 'Test User' }
) {
  return render(<AuthProvider initialUser={user}>{ui}</AuthProvider>);
}

describe('UserMenu', () => {
  it('shows the user display name', () => {
    renderAuthenticated(<UserMenu />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('opens the dropdown on click', async () => {
    const user = userEvent.setup();
    renderAuthenticated(<UserMenu />);
    await user.click(screen.getByRole('button', { name: /open user menu/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls sign out when the sign out menu item is clicked', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();
    renderAuthenticated(<UserMenu onSignOut={mockSignOut} />);
    await user.click(screen.getByRole('button', { name: /open user menu/i }));
    await user.click(within(screen.getByRole('menu')).getByText(/sign out/i));
    expect(mockSignOut).toHaveBeenCalledOnce();
  });
});
```

---

## 5. Async Data Fetching Test

```typescript
// src/components/pages/ProjectsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProjectsPage } from './ProjectsPage';

// Mock the Supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'Project Alpha', status: 'active' },
        { id: '2', name: 'Project Beta', status: 'draft' },
      ],
      error: null,
    }),
  },
}));

describe('ProjectsPage', () => {
  it('shows a loading state initially', () => {
    render(<ProjectsPage />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders projects after data loads', async () => {
    render(<ProjectsPage />);
    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
    });
  });

  it('shows an empty state when no projects exist', async () => {
    const { supabase } = await import('@/lib/supabase');
    vi.mocked(supabase.limit).mockResolvedValueOnce({ data: [], error: null });
    render(<ProjectsPage />);
    await waitFor(() => {
      expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
    });
  });
});
```

---

## 6. Form Submission Test

```typescript
// src/components/auth/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('calls onSubmit with email and password on valid submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows an error message on invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```
