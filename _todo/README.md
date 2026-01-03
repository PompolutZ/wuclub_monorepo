# Frontend v2 - Improvement Tasks

> This directory contains actionable improvement tasks for `apps/frontend_v2`, organized by priority level.

## Directory Structure

```
_todo/
├── README.md                    # This file - overview and index
├── frontend-improvements.md     # Original analysis document
├── high-priority/              # Quick wins, critical improvements
├── medium-priority/            # Valuable improvements, moderate effort
└── low-priority/               # Nice-to-haves, technical debt
```

---

## Quick Start

### Week 1: High Priority Tasks (4-5 hours)

Start here for maximum impact with minimal effort:

1. **[Console Logging Cleanup](high-priority/01-console-logging-cleanup.md)** (2 hours)
   - Remove bare `console.error()` calls
   - Add proper error handling
   - Implement centralized logger

2. **[TypeScript Critical Files](high-priority/02-typescript-critical-files.md)** (1.5 hours)
   - Convert `main.jsx` → `main.tsx`
   - Convert `useAuthUser.jsx` → `useAuthUser.tsx`
   - Add type safety to entry points

3. **[ErrorBoundary Fixes](high-priority/03-error-boundary-fixes.md)** (1 hour)
   - Remove commented code
   - Add user-friendly error messages
   - Improve accessibility

**Total Effort:** ~4.5 hours
**Impact:** Better code quality, user experience, type safety

---

### Week 2-3: Medium Priority Tasks (8-13 hours)

Follow up with these valuable improvements:

1. **[TypeScript Shared Components](medium-priority/01-typescript-shared-components.md)** (4-6 hours)
   - Convert frequently used components to TypeScript
   - Add proper prop interfaces
   - Improve developer experience

2. **[Performance Optimizations](medium-priority/02-performance-optimizations.md)** (2-3 hours)
   - Add `React.memo` to expensive components
   - Optimize with `useCallback`
   - Reduce unnecessary re-renders

3. **[User-Facing Error Messages](medium-priority/03-user-facing-error-messages.md)** (2 hours)
   - Add error states to UI
   - Create reusable error components
   - Improve error feedback

4. **[Vite Build Optimization](medium-priority/04-vite-build-optimization.md)** (2 hours)
   - Enhanced code splitting
   - Image optimization
   - Better bundling strategy

**Total Effort:** ~10-13 hours
**Impact:** Better performance, user experience, smaller bundles

---

### Future: Low Priority Tasks (6-9 hours)

When time permits, tackle these:

1. **[Dependency Updates](low-priority/01-dependency-updates.md)** (1-2 hours)
   - Update Immutable.js to v4
   - Stabilize beta dependencies
   - Security patches

2. **[Technical Debt Cleanup](low-priority/02-technical-debt-cleanup.md)** (2-3 hours)
   - Address TODO comments
   - Remove dead code
   - Create GitHub issues for long-term work

3. **[Class Components Refactor](low-priority/03-class-components-refactor.md)** (3-4 hours)
   - Convert class components to functional
   - Modern React patterns
   - Better consistency

**Total Effort:** ~6-9 hours
**Impact:** Code maintainability, modern patterns

---

## Task Index

### By Priority

#### High Priority
| Task | File | Effort | Impact |
|------|------|--------|--------|
| Console Logging Cleanup | [01-console-logging-cleanup.md](high-priority/01-console-logging-cleanup.md) | 2h | High |
| TypeScript Critical Files | [02-typescript-critical-files.md](high-priority/02-typescript-critical-files.md) | 1.5h | High |
| ErrorBoundary Fixes | [03-error-boundary-fixes.md](high-priority/03-error-boundary-fixes.md) | 1h | Medium |

#### Medium Priority
| Task | File | Effort | Impact |
|------|------|--------|--------|
| TypeScript Shared Components | [01-typescript-shared-components.md](medium-priority/01-typescript-shared-components.md) | 4-6h | Medium |
| Performance Optimizations | [02-performance-optimizations.md](medium-priority/02-performance-optimizations.md) | 2-3h | Medium |
| User-Facing Error Messages | [03-user-facing-error-messages.md](medium-priority/03-user-facing-error-messages.md) | 2h | Medium |
| Vite Build Optimization | [04-vite-build-optimization.md](medium-priority/04-vite-build-optimization.md) | 2h | Medium |

#### Low Priority
| Task | File | Effort | Impact |
|------|------|--------|--------|
| Dependency Updates | [01-dependency-updates.md](low-priority/01-dependency-updates.md) | 1-2h | Low |
| Technical Debt Cleanup | [02-technical-debt-cleanup.md](low-priority/02-technical-debt-cleanup.md) | 2-3h | Low |
| Class Components Refactor | [03-class-components-refactor.md](low-priority/03-class-components-refactor.md) | 3-4h | Low |

---

### By Category

#### Type Safety & TypeScript
- [TypeScript Critical Files](high-priority/02-typescript-critical-files.md) - HIGH
- [TypeScript Shared Components](medium-priority/01-typescript-shared-components.md) - MEDIUM

#### Error Handling & UX
- [Console Logging Cleanup](high-priority/01-console-logging-cleanup.md) - HIGH
- [ErrorBoundary Fixes](high-priority/03-error-boundary-fixes.md) - HIGH
- [User-Facing Error Messages](medium-priority/03-user-facing-error-messages.md) - MEDIUM

#### Performance
- [Performance Optimizations](medium-priority/02-performance-optimizations.md) - MEDIUM
- [Vite Build Optimization](medium-priority/04-vite-build-optimization.md) - MEDIUM

#### Code Quality
- [Technical Debt Cleanup](low-priority/02-technical-debt-cleanup.md) - LOW
- [Class Components Refactor](low-priority/03-class-components-refactor.md) - LOW

#### Dependencies
- [Dependency Updates](low-priority/01-dependency-updates.md) - LOW

---

## Estimated Timeline

### Sprint 1 (Week 1): Quick Wins
- **Effort:** 4-5 hours
- **Tasks:** All high-priority items
- **Impact:** Immediate code quality improvements

### Sprint 2 (Week 2): TypeScript & Performance
- **Effort:** 6-9 hours
- **Tasks:** TypeScript components + Performance optimizations
- **Impact:** Better developer experience, faster app

### Sprint 3 (Week 3): UX & Build
- **Effort:** 4 hours
- **Tasks:** Error messages + Vite optimization
- **Impact:** Better user experience, smaller bundles

### Future Sprints: Maintenance
- **Effort:** 6-9 hours
- **Tasks:** All low-priority items
- **Impact:** Long-term maintainability

---

## Success Metrics

Track these metrics before and after implementation:

### Code Quality
- [ ] TypeScript coverage: 40% → 80%+
- [ ] Console.* statements: 20+ → 0 (bare calls)
- [ ] TODO comments: Vague → Linked to issues
- [ ] Dead code: Present → Removed

### Performance
- [ ] Lighthouse score: ? → 90+
- [ ] Bundle size: ? → 20% reduction
- [ ] Re-render count: ? → 50% reduction
- [ ] Load time: ? → < 2s

### User Experience
- [ ] Silent errors: Many → None
- [ ] Error recovery: None → Present
- [ ] Loading states: Missing → Everywhere
- [ ] Accessibility: Basic → WCAG AA

---

## How to Use This Directory

### For Individual Tasks

1. Pick a task from the priority folder
2. Read the task document
3. Follow implementation steps
4. Check off testing checklist
5. Mark task as complete

### For Planning

1. Review task index above
2. Estimate team capacity
3. Assign tasks based on priority
4. Track progress in GitHub issues

### For Onboarding

New team members can:
1. Start with high-priority tasks
2. Learn codebase patterns
3. Make immediate impact
4. Build confidence

---

## Contributing

When adding new improvement tasks:

1. Choose appropriate priority folder
2. Use consistent naming: `##-descriptive-name.md`
3. Include these sections:
   - **Priority, Effort, Impact**
   - **Problem description**
   - **Proposed solution**
   - **Implementation steps**
   - **Testing checklist**
   - **Success criteria**
4. Update this README.md index
5. Link to GitHub issues if applicable

---

## Notes

- **Don't over-engineer:** These are low-hanging improvements, not rewrites
- **Test thoroughly:** Each change should be tested before moving on
- **One at a time:** Don't try to do everything at once
- **Document changes:** Update CLAUDE.md if patterns change
- **Celebrate wins:** Track completed tasks and improvements

---

## Questions?

- Check individual task documents for detailed guidance
- Review [frontend-improvements.md](frontend-improvements.md) for full analysis
- Create GitHub issues for questions or new tasks discovered

---

**Last Updated:** 2026-01-03
**Status:** Ready for implementation
**Total Tasks:** 10 improvements across 3 priority levels
