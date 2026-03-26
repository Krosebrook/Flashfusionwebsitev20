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

## What Changed

<!-- Describe the specific files, components, or systems modified and why -->

## Testing

<!-- Step-by-step instructions for reviewers to verify this PR -->
1. 
2. 

<!-- Include unit test results, manual test steps, or screenshots -->

## Security Impact

<!-- Does this PR touch authentication, authorization, secrets, infrastructure, or middleware? -->
- [ ] This PR modifies security-sensitive code or configuration

> If this PR touches `src/auth/`, `infra/`, `secrets/`, `middleware/`, `.env`, `terraform/`, or `helm/` paths, add the comment `@security-review` below to trigger a mandatory security review.

<!-- @security-review -->

## Rollback Plan

<!-- How do we revert this change if it causes issues in production? -->
- Revert commit: `git revert <sha>`
- Feature flag: <!-- if applicable -->
- Other: <!-- migration rollback steps, etc. -->

---

## Checklist

### Correctness
- [ ] Feature works as described in the linked issue
- [ ] Loading, error, and empty states handled
- [ ] No `console.log` left in code

### Type Safety
- [ ] No `any` type or `@ts-ignore` without explanation
- [ ] User inputs validated

### Testing
- [ ] Tests added for new logic; `npm test` passes locally
- [ ] Coverage has not decreased

### Security
- [ ] No secrets or API keys committed to code
- [ ] Security-sensitive paths labeled `security-review` if applicable
- [ ] New Supabase tables have RLS policies

### Accessibility
- [ ] Interactive elements keyboard-accessible
- [ ] Images have `alt` text

### Documentation
- [ ] `docs/` updated if behaviour or API changed
