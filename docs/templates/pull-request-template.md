# Pull Request

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

## Changes Made

<!-- Bullet list of notable changes -->
- 
- 
- 

## How to Test

<!-- Step-by-step instructions for reviewers to verify this PR -->
1. 
2. 
3. 

## Screenshots / Recordings (if UI changed)

<!-- Drag and drop images or video here -->

---

## Author Checklist

### Correctness
- [ ] Feature works as described in the linked issue
- [ ] Loading, error, and empty states are handled
- [ ] No `console.log` left in code

### Type Safety
- [ ] No `any` type or `@ts-ignore` without explanation
- [ ] Zod validates all user input
- [ ] Supabase queries use generated TypeScript types

### Testing
- [ ] Unit / component tests added for new logic
- [ ] `npm test` passes locally
- [ ] Coverage has not decreased

### Security
- [ ] No secrets or API keys in code
- [ ] User-owned Supabase tables have RLS policies
- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitisation

### Accessibility
- [ ] Interactive elements are keyboard-accessible
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Colour contrast meets WCAG 2.1 AA

### Documentation
- [ ] `docs/` updated if behaviour or API changed
- [ ] PR description explains the _why_, not just the _what_

---

## Reviewer Notes

<!-- Optional: anything you want reviewers to focus on or known limitations -->
