# Dependency Updates

**Priority:** LOW
**Effort:** 1-2 hours
**Impact:** Security, stability, future compatibility

## Problem

Several dependencies are outdated and should be updated to maintain security and access to latest features.

## Dependencies to Update

### 1. Immutable.js (30 min) - SAFE UPDATE

**Current:** `immutable: ^3.8.2`
**Latest:** `immutable: ^4.3.0`
**Breaking Changes:** Minimal

**Steps:**

```bash
cd apps/frontend_v2
pnpm add immutable@^4.3.0
```

**Migration notes:**
- API mostly backward compatible
- Check for deprecated methods
- Test all uses of Immutable data structures

**Files to check:**
```bash
# Find all files using immutable
pnpm exec grep -r "from 'immutable'" src/
```

**Testing:**
- [ ] All Immutable data structures work
- [ ] No runtime errors
- [ ] Performance is acceptable

---

### 2. @tanstack/react-virtual (30 min) - CHECK FOR STABLE

**Current:** `@tanstack/react-virtual: 3.0.0-beta.54`
**Action:** Check if stable v3 is available

**Steps:**

```bash
# Check latest version
pnpm info @tanstack/react-virtual versions

# If stable v3 available:
pnpm add @tanstack/react-virtual@^3.0.0

# If not, stay on beta or consider v2 stable
```

**Note:** Beta versions in production are not ideal

---

### 3. React Tooltip (1 hour) - CONSIDER UPGRADE

**Current:** `react-tooltip: ^4.5.0`
**Latest:** `react-tooltip: ^5.x`
**Breaking Changes:** Significant API changes

**Decision:** Low priority - v4 still supported

**If upgrading:**
- Read migration guide
- Update all tooltip usage
- Test tooltip positioning

**Files using tooltips:**
```bash
pnpm exec grep -r "react-tooltip" src/
```

---

### 4. Node Version Alignment (15 min)

**Current in package.json:** `20.19.4`
**Current in CLAUDE.md:** `20.13.0`
**Action:** Align version specification

**Update CLAUDE.md:**
```markdown
- **Node Version**: 20.19.4 (managed via Volta)
```

Or update package.json if 20.13.0 is preferred.

---

## Long-term Updates (Future Consideration)

### React Router v5 → v6

**Effort:** 8-12 hours
**Breaking Changes:** Extensive

This is a major migration - see separate document: `_todo/long-term/react-router-v6-migration.md`

---

## Implementation Steps

### Step 1: Check Current Vulnerabilities

```bash
cd apps/frontend_v2
pnpm audit

# Fix auto-fixable issues
pnpm audit fix
```

### Step 2: Update Immutable.js

```bash
pnpm add immutable@^4.3.0
pnpm install
```

**Test:**
- Run app: `pnpm dev`
- Check all features using Immutable
- Run build: `pnpm build`

### Step 3: Check React Virtual

```bash
pnpm info @tanstack/react-virtual

# If stable v3 available, update
pnpm add @tanstack/react-virtual@^3.0.0
```

**Test:**
- Card lists render correctly
- Scrolling performance acceptable
- Virtual rendering works

### Step 4: Align Node Versions

Update documentation to match actual version in use.

---

## Testing Checklist

### After Each Update

- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` completes successfully
- [ ] `pnpm lint` passes
- [ ] Application runs correctly
- [ ] No new console errors
- [ ] Performance acceptable

### Integration Testing

- [ ] All pages load
- [ ] Data structures work (Immutable)
- [ ] Lists scroll properly (react-virtual)
- [ ] Tooltips display (react-tooltip if updated)

---

## Success Criteria

- [ ] Immutable.js updated to v4
- [ ] React-virtual using stable version (if available)
- [ ] No security vulnerabilities
- [ ] All tests passing
- [ ] Application functions correctly

---

## Rollback Plan

If issues arise:

```bash
# Revert package.json changes
git checkout package.json pnpm-lock.yaml

# Reinstall
pnpm install
```

Or update package.json manually to previous versions.

---

## Notes

- Update dependencies one at a time
- Test thoroughly after each update
- Don't update everything at once
- Check changelogs for breaking changes
- Consider impact on bundle size
