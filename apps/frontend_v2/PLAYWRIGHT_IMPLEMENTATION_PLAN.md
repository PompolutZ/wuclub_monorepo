# Playwright E2E Testing Implementation Plan

**Project:** WUnderworlds Club Frontend (apps/frontend_v2)
**Status:** Phase 2 In Progress
**Started:** 2026-01-03
**Last Updated:** 2026-01-04

## Executive Summary

Implementation plan for Playwright end-to-end testing infrastructure covering critical user flows. Tests run locally against staging environment (yawudb-test) with auth state reuse for performance.

**Progress:** 5/16 tests passing (31% of Phase 2 complete)

---

## ✅ Phase 1: Foundation Setup (COMPLETE)

**Status:** ✅ Complete (2026-01-03)

**Deliverables:**
- Playwright installed and configured
- Global auth setup with state reuse
- Authenticated and anonymous fixtures
- Base page objects (BasePage, LoginPage)
- First test suite (login.spec.ts) with 5 passing tests
- Package.json scripts and documentation

---

## 🚧 Phase 2: Deck CRUD Operations (IN PROGRESS)

**Status:** 16 tests created, 0 passing (2026-01-04)

**Summary:** Test deck creation, viewing, editing, deletion, and My Decks page functionality. Each test may require fixes to either the test implementation or the actual application code.

**Files Created:**
- **Page Objects:** DeckCreatorPage.ts, MyDecksPage.ts, DeckViewPage.ts
- **Helpers:** deckHelpers.ts, apiHelpers.ts
- **Test Data:** validDecks.ts
- **Specs:** create-deck.spec.ts, view-deck.spec.ts, update-deck.spec.ts, delete-deck.spec.ts, my-decks.spec.ts

### Test-by-Test Breakdown

Each test below needs individual attention to identify and fix issues:

#### 2.1 - create-deck.spec.ts → "should create a valid deck with 32 cards"
**What it tests:** Creating a complete 32-card deck and verifying it appears in My Decks
**Potential issues:** Card selection UI, save button, navigation after save, deck name persistence

#### 2.2 - create-deck.spec.ts → "should prevent saving deck with too few cards"
**What it tests:** Validation prevents saving incomplete decks
**Potential issues:** Validation message selectors, save button state, error message visibility

#### 2.3 - create-deck.spec.ts → "should allow removing cards from deck"
**What it tests:** Toggle behavior - clicking a card again removes it
**Potential issues:** Card toggle logic, deck count updates

#### 2.4 - create-deck.spec.ts → "should persist deck name"
**What it tests:** Deck name is saved and appears correctly in My Decks
**Potential issues:** Input field selectors, name persistence

#### 2.5 - create-deck.spec.ts → "should clear deck on reset"
**What it tests:** Reset button clears all cards with confirmation
**Potential issues:** Reset button selector, confirmation dialog, deck count after reset

#### 2.6 - view-deck.spec.ts → "should display deck details correctly"
**What it tests:** Deck view page shows correct name and card counts
**Potential issues:** Deck name selector, card count selectors, page load timing

#### 2.7 - view-deck.spec.ts → "should show edit button for own decks"
**What it tests:** Edit button is visible for user's own decks
**Potential issues:** Edit button selector, button visibility

#### 2.8 - view-deck.spec.ts → "should show delete button for own decks"
**What it tests:** Delete button exists for user's own decks
**Potential issues:** Delete button selector, actions menu on mobile

#### 2.9 - update-deck.spec.ts → "should update deck name"
**What it tests:** Editing a deck and changing its name persists
**Potential issues:** Edit flow, name update, My Decks refresh

#### 2.10 - update-deck.spec.ts → "should save changes to deck cards"
**What it tests:** Card changes are saved when editing a deck
**Potential issues:** Edit mode card selection, save persistence

#### 2.11 - delete-deck.spec.ts → "should delete deck from My Decks page"
**What it tests:** Deleting a deck from My Decks page with confirmation
**Potential issues:** Delete button selector, confirmation dialog, deck removal

#### 2.12 - delete-deck.spec.ts → "should delete deck from Deck View page"
**What it tests:** Deleting a deck from the view page and redirecting
**Potential issues:** Delete button in view, confirmation, redirect to /mydecks

#### 2.13 - delete-deck.spec.ts → "should cancel deck deletion"
**What it tests:** Cancel button in delete confirmation keeps the deck
**Potential issues:** Cancel button selector, deck persistence after cancel

#### 2.14 - my-decks.spec.ts → "should show empty state when no decks exist"
**What it tests:** Empty state message appears when user has no decks
**Potential issues:** Empty state selector, message visibility

#### 2.15 - my-decks.spec.ts → "should list all user decks"
**What it tests:** Multiple decks appear in My Decks list
**Potential issues:** Deck list rendering, multiple deck creation timing

#### 2.16 - my-decks.spec.ts → "should sort decks by updated date (newest first)"
**What it tests:** Decks are ordered by most recently updated first
**Potential issues:** Sorting logic, timestamp handling, element positioning

---

## Workflow for Phase 2

For each failing test:
1. Run the specific test to see the failure
2. Identify if issue is in test code (selectors, assertions) or app code (functionality)
3. Fix the issue (test or implementation)
4. Verify fix with `pnpm test:e2e <test-file>`
5. Move to next test

**Commands:**
```bash
# Run specific test file
pnpm test:e2e tests/e2e/specs/02-decks/create-deck.spec.ts

# Run specific test by name
pnpm test:e2e -g "should create a valid deck with 32 cards"

# Debug mode
pnpm test:e2e:debug tests/e2e/specs/02-decks/create-deck.spec.ts
```

---

## 🚧 Phase 3: Export, Browsing & Profile (NOT STARTED)

**Goals:** Test deck export, card library browsing, user profile, and public deck discovery

**Page Objects:** LibraryPage.ts, UserProfilePage.ts, BrowseDecksPage.ts
**Helpers:** wait.helpers.ts
**Tests:** ~12-15 tests covering export, search, filters, profile editing, and browsing

---

## 🚧 Phase 4: Responsive & Edge Cases (NOT STARTED)

**Goals:** Mobile-specific tests, anonymous user flows, IndexedDB sync, UI components

**Tests:** ~8-10 tests covering mobile layouts, anonymous deck creation, login sync, modals, and toasts

---

## 🚧 Phase 5: Polish & Documentation (NOT STARTED)

**Goals:** Test tags, performance optimization, documentation, code review

**Tasks:** Add @smoke/@critical tags, remove hard waits, update README, team onboarding

---

## Success Metrics

### Overall Target
- 30+ E2E tests passing
- Test suite < 10 minutes execution time
- 80%+ critical path coverage

### Current Progress
- **Phase 1:** ✅ 5/5 tests (100%)
- **Phase 2:** 🚧 0/16 tests (0%)
- **Total:** 5/21 tests (24%)

---

## Scripts & Commands

```bash
# Run all tests (headless)
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# Headed mode (see browser)
pnpm test:e2e:headed

# Debug mode
pnpm test:e2e:debug

# View report
pnpm test:e2e:report

# Run specific file
pnpm test:e2e tests/e2e/specs/02-decks/create-deck.spec.ts

# Run by tag (after Phase 5)
pnpm test:e2e --grep @smoke
```

---

## Dependencies

- [x] Playwright installed
- [ ] `.env.test` file with staging credentials
- [ ] Playwright browsers installed
- [ ] Dev server running
- [ ] Test user account in Firebase staging

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | 2-3 days | ✅ Complete (Jan 3) |
| Phase 2: Deck CRUD | 3-4 days | 🚧 In Progress (Jan 4) |
| Phase 3: Export/Browse/Profile | 3-4 days | 🚧 Not Started |
| Phase 4: Responsive/Edge Cases | 2-3 days | 🚧 Not Started |
| Phase 5: Polish | 2 days | 🚧 Not Started |
| **Total** | **12-16 days** | **31% Complete** |

---

**Next Review:** After all Phase 2 tests pass
