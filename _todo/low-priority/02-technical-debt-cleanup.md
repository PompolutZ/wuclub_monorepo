# Technical Debt Cleanup

**Priority:** LOW
**Effort:** 2-3 hours
**Impact:** Code maintainability, documentation

## Problem

Several TODO/FIXME comments and commented-out code exist in the codebase, indicating technical debt that should be addressed or documented properly.

## TODO Comments to Address

### 1. `src/pages/MyDecks/useAnonDeckSyncronisation.ts:6`

**TODO:** https://github.com/PompolutZ/wuclub_monorepo/issues/3

**Action:**
- Review GitHub issue #3
- If resolved, remove TODO
- If not resolved, update comment with current status
- Consider creating a better solution

**Priority:** Low - functionality works, just needs cleanup

---

### 2. `src/shared/hooks/useSaveDeck.ts:15-16, 28`

**TODO:** "This is not nice"
**HACK:** "This is a hack to skip rebuilding all api endpoints for now"

**Current Issue:**
- Temporary workaround in place
- Should be replaced with proper solution

**Proposed Solution:**
```typescript
// Instead of hack, properly rebuild API endpoints or:
// Document why this approach is necessary

// If this is the correct approach:
// Remove TODO and document the pattern

// If it's truly a hack:
// Create GitHub issue to track proper fix
// Link issue in comment
```

**Action:**
- Review the hack
- Either fix properly or document why it's needed
- If keeping, create issue and link in comment

---

### 3. `src/shared/hooks/useUpdateDeck.ts:21-22`

**TODO:** "This is not nice"

Similar to above - needs review and proper solution or documentation.

---

### 4. `src/services/db.ts:5`

**TODO:** https://github.com/PompolutZ/wuclub_monorepo/issues/4

**Action:**
- Review GitHub issue #4
- Implement solution if straightforward
- Update comment if still pending

---

### 5. `src/pages/DeckCreator/useStateCreator.js:98-100`

**Issue:** Commented-out code

**Current:**
```javascript
// TODO: some commented code that shouldn't be there
```

**Action:**
- Review the commented code
- Either uncomment if needed
- Or delete if obsolete
- Don't leave dead code in codebase

---

## Commented Code to Review

### Files with Commented Code

Search for commented code blocks:

```bash
# Find large blocks of commented code
pnpm exec grep -r "^[[:space:]]*//" src/ | grep -v "TODO" | grep -v "FIXME"
```

**Action for each:**
1. Review why it's commented
2. If needed, uncomment
3. If not needed, delete
4. If keeping for reference, move to git history notes

---

## Implementation Steps

### Step 1: Audit All TODOs (30 min)

```bash
cd apps/frontend_v2

# Find all TODO comments
pnpm exec grep -rn "TODO" src/

# Find all FIXME comments
pnpm exec grep -rn "FIXME" src/

# Find all HACK comments
pnpm exec grep -rn "HACK" src/
```

Create a spreadsheet:
| File | Line | Comment | Action | Priority |
|------|------|---------|--------|----------|
| ... | ... | ... | ... | ... |

### Step 2: Categorize TODOs (15 min)

For each TODO:
- **Quick fix** (< 30 min): Fix immediately
- **Medium effort** (1-2 hours): Create separate task
- **Long-term** (> 2 hours): Create GitHub issue
- **Documentation only**: Just needs better comment

### Step 3: Fix Quick Wins (1 hour)

Fix or properly document TODOs that take < 30 min each.

### Step 4: Create Issues for Long-term (30 min)

For complex TODOs:
1. Create GitHub issue
2. Add context and proposed solution
3. Link issue in code comment
4. Remove vague TODO, replace with issue link

**Example:**

```typescript
// Before
// TODO: This is not nice

// After
// TODO: Refactor to use proper API client pattern
// See: https://github.com/PompolutZ/wuclub_monorepo/issues/42
```

### Step 5: Remove Dead Code (30 min)

Delete all commented-out code that serves no purpose.

---

## Create TODO Management Convention

Document in CLAUDE.md or CONTRIBUTING.md:

```markdown
## TODO Comments

When adding TODO comments, follow this format:

### Quick fixes (will be done soon)
```typescript
// TODO: Add loading state
```

### Known issues (linked to GitHub)
```typescript
// TODO: Optimize performance - see issue #123
// https://github.com/org/repo/issues/123
```

### Temporary workarounds
```typescript
// HACK: Temporary workaround until API v2 is ready
// TODO: Remove after API v2 migration - target: Q2 2025
```

### Don't use vague TODOs
```typescript
// ❌ Bad
// TODO: Fix this
// TODO: This is not nice

// ✅ Good
// TODO: Handle error state when user is offline
// TODO: Refactor to use React Query instead of manual fetch
```
```

---

## Testing Checklist

After cleanup:

- [ ] All files compile
- [ ] `pnpm lint` passes
- [ ] Application runs correctly
- [ ] No functionality broken
- [ ] TODOs are clear and actionable
- [ ] No orphaned commented code

---

## Success Criteria

- [ ] All TODO comments reviewed
- [ ] Vague TODOs replaced with specific ones
- [ ] GitHub issues created for long-term work
- [ ] Dead code removed
- [ ] Convention documented
- [ ] Codebase cleaner and more maintainable

---

## GitHub Issues to Create

Based on TODOs found, create issues for:

### Issue Template

**Title:** [TODO] Specific description

**Description:**
```
## Current State
[What exists now]

## Problem
[Why this is not ideal]

## Proposed Solution
[How to fix it]

## Affected Files
- `src/path/to/file.ts:123`

## Priority
- [ ] Low - technical debt
- [ ] Medium - affects UX
- [ ] High - security/performance

## Estimated Effort
[Time estimate]
```

---

## Example Cleanup

### Before

```typescript
// TODO: This is not nice
const result = await fetch(url);
const data = await result.json();
return data;
```

### After (if fixing)

```typescript
// Proper error handling with type safety
async function fetchData<T>(url: string): Promise<T> {
  try {
    const result = await fetch(url);

    if (!result.ok) {
      throw new Error(`HTTP ${result.status}: ${result.statusText}`);
    }

    return await result.json();
  } catch (error) {
    logger.error('Fetch failed', error, { url });
    throw error;
  }
}
```

### After (if deferring)

```typescript
// TODO: Add proper error handling and type safety
// See: https://github.com/PompolutZ/wuclub_monorepo/issues/42
const result = await fetch(url);
const data = await result.json();
return data;
```

---

## Notes

- Don't remove TODOs that are genuinely useful
- Do remove TODOs that are vague or outdated
- Create issues for complex TODOs
- Document patterns for future contributors
