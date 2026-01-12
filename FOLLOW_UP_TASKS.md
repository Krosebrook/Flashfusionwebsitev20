# Follow-Up Tasks

## 1. Package Dependencies Cleanup (Priority: High)

### Issue
The `package.json` file contains references to non-existent `@flashfusion/*` packages that prevent `npm install` from working:

```json
"@flashfusion/api-client": "*",
"@flashfusion/config": "*",
"@flashfusion/hooks": "*",
"@flashfusion/services": "*",
"@flashfusion/types": "*",
"@flashfusion/ui": "*",
"@flashfusion/utils": "*"
```

### Impact
- Cannot run `npm install` without `--legacy-peer-deps`
- Cannot build the application
- Cannot run tests or development server
- Build/CI pipelines will fail

### Recommendation
Choose one of these approaches:

**Option A: Remove Missing Packages (Recommended)**
- Remove all `@flashfusion/*` dependencies from package.json
- These appear to be planned workspace packages that were never implemented
- The application likely has inline implementations instead

**Option B: Create Workspace Packages**
- Set up a monorepo structure with pnpm workspaces
- Create the missing `@flashfusion/*` packages
- Refactor code to use the workspace packages
- More work but provides better organization

### Steps for Option A (Quick Fix)
1. Edit `package.json`
2. Remove lines referencing `@flashfusion/*` packages
3. Run `npm install` to verify
4. Check for any import errors in the code
5. Fix imports as needed (likely few to none)

## 2. Storybook Version Conflict (Priority: Medium)

### Issue
Conflicting Storybook peer dependencies:
- `@storybook/react@10.1.11` (peer: storybook@^10.1.11)
- `@storybook/test@8.6.15` (peer: storybook@^8.6.15)

### Recommendation
Align Storybook packages to same major version (either all v10 or all v8)

### Steps
1. Choose target Storybook version (recommend v10 - latest)
2. Update `@storybook/test` to v10.x
3. Run `npm install` to verify
4. Test Storybook functionality

## 3. Additional Documentation Cleanup (Priority: Low)

### Issue
112 markdown files still remain in `src/` directory, many may be outdated or redundant.

### Recommendation
- Review remaining documentation files
- Move general docs to `docs/` directory
- Move outdated docs to `docs/archive/`
- Keep only actively used docs in `src/`

### Categories to Review
- Phase/Step documentation (PHASE_*.md, STEP_*.md)
- Guide documentation (*_GUIDE.md)
- Status/Report documentation (*_STATUS.md, *_REPORT.md)
- Test documentation (*_TEST.md)

## 4. Build Verification (Priority: High)

### Issue
Build has not been verified after refactoring.

### Steps
1. Fix package.json dependencies (Task #1)
2. Run `npm install`
3. Run `npm run build`
4. Fix any build errors
5. Verify application functionality

## 5. Create .editorconfig (Priority: Low)

### Recommendation
Add `.editorconfig` for consistent code formatting across editors:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## Task Priority Summary

1. **High Priority** (Required for basic functionality)
   - [ ] Fix package.json dependencies
   - [ ] Verify build works

2. **Medium Priority** (Improves development experience)
   - [ ] Resolve Storybook version conflict

3. **Low Priority** (Nice to have)
   - [ ] Additional documentation cleanup
   - [ ] Add .editorconfig

---

**Note:** These tasks are separate from the refactoring work and should be addressed in follow-up PRs.
