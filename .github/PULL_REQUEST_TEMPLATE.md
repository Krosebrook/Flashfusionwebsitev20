## Summary

<!-- What does this PR do? Why is this change needed? (1–3 sentences) -->

## Type of Change

- [ ] `feat` — New feature
- [ ] `fix` — Bug fix
- [ ] `hotfix` — Critical production fix
- [ ] `refactor` — Code restructure (no feature/fix)
- [ ] `perf` — Performance improvement
- [ ] `test` — Adding or updating tests
- [ ] `docs` — Documentation only
- [ ] `chore` — Build, CI, dependency update
- [ ] `style` — Formatting, no logic change

## Linked Issue(s)

<!-- Closes #<issue-number> -->

## How to Test

<!-- Step-by-step instructions for reviewers to verify this PR -->
1. 
2. 

## Screenshots (if UI changed)

<!-- Drag and drop images here -->

---

## Author Checklist

### Correctness
- [ ] Feature works as described in the linked issue
- [ ] Loading, error, and empty states handled
- [ ] No `console.log` left in code

### Type Safety
- [ ] No `any` type or `@ts-ignore` without explanation
- [ ] User inputs validated with Zod

### Testing
- [ ] Tests added for new logic; `npm test` passes locally
- [ ] Coverage has not decreased

### Security
- [ ] No secrets or API keys in code
- [ ] New Supabase tables have RLS policies

### Accessibility
- [ ] Interactive elements keyboard-accessible
- [ ] Images have `alt` text

### Documentation
- [ ] `docs/` updated if behaviour or API changed
