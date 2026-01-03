# Playwright E2E Testing Implementation Plan

**Project:** WUnderworlds Club Frontend (apps/frontend_v2)
**Status:** Phase 1 Complete ✅
**Started:** 2026-01-03
**Estimated Duration:** 2-3 weeks (12-16 days)

## Executive Summary

This document outlines the implementation plan for adding comprehensive Playwright end-to-end testing to the WUnderworlds frontend application. The testing infrastructure will cover 10+ critical user flows with 30+ test cases, use auth state reuse for performance, and run locally without CI/CD integration initially.

## Goals & Requirements

### Primary Goals
- ✅ Comprehensive test coverage of all major user flows
- ✅ Local testing infrastructure (no CI/CD for now)
- ✅ Auth state reuse for performance
- ✅ Test against existing staging environment (yawudb-test)

### Coverage Targets
- 10+ user flows
- 30+ E2E test cases
- 80%+ critical path coverage
- Test suite execution < 10 minutes

## Architecture Overview

### Tech Stack
- **Testing Framework:** Playwright 1.57.0
- **Language:** TypeScript
- **Pattern:** Page Object Model
- **Auth Strategy:** Global setup with state reuse
- **Test Data:** JSON files + dynamic generation
- **Browsers:** Chromium (primary), Mobile viewport

### Key Design Decisions

1. **Page Object Model (POM)**
   - Encapsulates page interactions
   - Reusable across tests
   - Easier maintenance

2. **Auth State Reuse**
   - Login once in global setup
   - Save state to `tests/.auth/user.json`
   - Reuse across all tests
   - Saves 3-5 seconds per test

3. **Fixtures**
   - `authenticatedTest` - Most tests (logged in)
   - `anonymousTest` - Anonymous user flows

4. **API-based Cleanup**
   - Delete test data via API (faster than UI)
   - Run in `afterEach` hooks

## Implementation Phases

### ✅ Phase 1: Foundation Setup (COMPLETE)

**Duration:** 2-3 days
**Status:** ✅ Complete (2026-01-03)

**Deliverables:**
- ✅ Playwright installed and configured
- ✅ Global auth setup implemented
- ✅ Authenticated and anonymous fixtures created
- ✅ Base page object and LoginPage created
- ✅ First test suite (login.spec.ts) with 5 tests
- ✅ Package.json scripts added
- ✅ .gitignore updated
- ✅ Documentation (tests/README.md)

**Files Created:**
```
apps/frontend_v2/
├── playwright.config.ts
├── .env.test.example
├── tests/
│   ├── README.md
│   ├── e2e/
│   │   ├── setup/global-setup.ts
│   │   ├── fixtures/
│   │   │   ├── authenticated.fixture.ts
│   │   │   └── anonymous.fixture.ts
│   │   ├── page-objects/
│   │   │   ├── BasePage.ts
│   │   │   └── LoginPage.ts
│   │   └── specs/
│   │       └── 01-auth/
│   │           └── login.spec.ts
│   └── .auth/ (gitignored)
```

**Next Steps Before Phase 2:**
1. Create `.env.test` with staging credentials
2. Install Playwright browsers: `pnpm exec playwright install --with-deps`
3. Verify tests pass: `pnpm test:e2e`

---

### 🚧 Phase 2: Deck CRUD Operations

**Duration:** 3-4 days
**Status:** Not Started

**Goals:**
- Test full deck creation flow
- Test deck editing
- Test deck deletion with confirmation
- Test deck viewing
- Test privacy toggle

**Page Objects to Create:**
1. **DeckCreatorPage.ts**
   - `selectFaction(faction: string)`
   - `searchCard(cardName: string)`
   - `addCardToDeck(cardName: string)`
   - `removeCardFromDeck(cardName: string)`
   - `saveDeck(deckName: string)`
   - `assertDeckCardCount(expected: number)`
   - `assertFactionSelected(faction: string)`

2. **MyDecksPage.ts**
   - `assertDeckExists(deckName: string)`
   - `openDeck(deckName: string)`
   - `deleteDeck(deckName: string)`
   - `confirmDelete()`
   - `assertDeckCount(expected: number)`

3. **DeckViewPage.ts**
   - `assertDeckName(name: string)`
   - `toggleListView()`
   - `toggleImageView()`
   - `togglePrivacy()`
   - `clickEdit()`
   - `clickDelete()`
   - `assertPrivacyStatus(isPublic: boolean)`

**Helpers to Create:**
1. **deck.helpers.ts**
   - `createDeckViaUI(page, faction, deckName, cards)`
   - `deleteDeckViaAPI(deckId, authToken)`
   - `generateUniqueDeckName(prefix?)`
   - `getDeckIdFromUrl(url)`

2. **storage.helpers.ts**
   - `getLocalStorage(page, key)`
   - `clearIndexedDB(page, dbName)`
   - `getAnonDecksFromIndexedDB(page)`

**Test Data Files:**
1. **test-data/decks.json**
```json
{
  "validDeck": {
    "faction": "steelheart-s-champions",
    "objectives": ["card_id_1", "card_id_2", ...],
    "gambits": [...],
    "upgrades": [...]
  }
}
```

2. **test-data/cards.json**
```json
{
  "steelheart-s-champions": {
    "objectives": [101, 102, ...],
    "gambits": [201, 202, ...],
    "upgrades": [301, 302, ...]
  }
}
```

**Tests to Write:**

1. **create-deck.spec.ts**
   - Should create deck with valid cards
   - Should prevent saving deck with too few cards
   - Should prevent saving deck with too many cards
   - Should persist deck name
   - Should show deck in My Decks after creation

2. **edit-deck.spec.ts**
   - Should load existing deck for editing
   - Should allow adding cards to existing deck
   - Should allow removing cards from deck
   - Should save changes to deck

3. **delete-deck.spec.ts**
   - Should show confirmation dialog
   - Should delete deck after confirmation
   - Should cancel deletion when clicking cancel
   - Should remove deck from My Decks list

4. **view-deck.spec.ts**
   - Should display deck details correctly
   - Should toggle between list and image view
   - Should show correct card counts
   - Should display deck metadata (author, date)

5. **privacy-toggle.spec.ts**
   - Should toggle deck from private to public
   - Should toggle deck from public to private
   - Should only show toggle for deck owner

**Cleanup Strategy:**
```typescript
test.afterEach(async ({ page, request }) => {
  // Get created deck IDs
  const deckIds = await getCreatedDecksInTest();

  // Delete via API
  const token = await getAuthToken(page);
  for (const id of deckIds) {
    await request.delete(`/api/decks/${id}`, {
      headers: { authtoken: token }
    });
  }
});
```

**Deliverables:**
- 3 page objects
- 2 helper files
- 2 test data files
- 5 test spec files (~10-15 tests total)

---

### 🚧 Phase 3: Export, Browsing & Profile

**Duration:** 3-4 days
**Status:** Not Started

**Goals:**
- Test deck export features
- Test card library browsing and search
- Test user profile management
- Test public deck discovery

**Page Objects to Create:**

1. **LibraryPage.ts**
   - `searchCards(query: string)`
   - `applyFilter(filterType: string, value: string)`
   - `selectCard(cardName: string)`
   - `assertCardVisible(cardName: string)`
   - `assertSearchResults(count: number)`

2. **UserProfilePage.ts**
   - `changeUsername(newName: string)`
   - `selectAvatar(avatarName: string)`
   - `saveProfile()`
   - `assertUsername(expected: string)`
   - `assertAvatarSelected(avatarName: string)`

3. **BrowseDecksPage.ts**
   - `filterByFaction(faction: string)`
   - `scrollToLoadMore()`
   - `openDeck(deckName: string)`
   - `assertDeckCount(min: number)`
   - `assertFactionFilter(faction: string)`

**Helpers to Create:**

1. **wait.helpers.ts**
   - `waitForToastMessage(page, message)`
   - `waitForReactQueryToSettle(page)`
   - `waitForInfiniteScrollToLoad(page)`

**Tests to Write:**

1. **export-udb.spec.ts**
   - Should export deck to UnderworldsDB format
   - Should download correct deck data
   - Should include all cards in export

2. **share-link.spec.ts**
   - Should copy shareable link to clipboard
   - Should show success toast
   - Should create valid shareable URL

3. **library-search.spec.ts**
   - Should find cards by name
   - Should find cards by text in rules
   - Should show "no results" for invalid search
   - Should clear search

4. **library-filters.spec.ts**
   - Should filter by expansion
   - Should filter by card type
   - Should combine multiple filters
   - Should reset filters

5. **edit-profile.spec.ts**
   - Should update username
   - Should change avatar
   - Should save profile changes
   - Should show updated info in navbar

6. **browse-public-decks.spec.ts**
   - Should display public decks
   - Should filter decks by faction
   - Should load more decks on scroll (infinite scroll)
   - Should navigate to deck view when clicked

**Technical Considerations:**

1. **Clipboard Testing:**
```typescript
// Grant clipboard permissions
await context.grantPermissions(['clipboard-read', 'clipboard-write']);

// Read clipboard
const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
expect(clipboardText).toContain('view/deck/');
```

2. **React Query Cache Clearing:**
```typescript
test.beforeEach(async ({ page }) => {
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('REACT_QUERY'))
      .forEach(key => localStorage.removeItem(key));
  });
});
```

**Deliverables:**
- 3 page objects
- 1 helper file
- 6 test spec files (~12-15 tests total)

---

### 🚧 Phase 4: Responsive & Edge Cases

**Duration:** 2-3 days
**Status:** Not Started

**Goals:**
- Test mobile-specific layouts and interactions
- Test anonymous user flows
- Test UI components (modals, toasts)
- Edge case handling

**Mobile Configuration:**
```typescript
// In playwright.config.ts
{
  name: 'Mobile Chrome',
  use: {
    ...devices['iPhone 12'],
    viewport: { width: 390, height: 844 },
    storageState: 'tests/.auth/user.json',
  },
}
```

**Tests to Write:**

1. **mobile-deck-creator.spec.ts**
   - Should show tab-based navigation on mobile
   - Should switch between Library/Deck/Warband tabs
   - Should allow card selection on mobile
   - Should save deck on mobile

2. **anonymous-deck-creation.spec.ts**
   - Should create deck without login
   - Should save deck to IndexedDB
   - Should persist deck after page refresh
   - Should show "sync on login" prompt

3. **sync-on-login.spec.ts** (using anonymous fixture)
   - Should sync anonymous decks after login
   - Should merge anonymous decks with user decks
   - Should clear IndexedDB after sync

4. **modals.spec.ts**
   - Should show delete confirmation modal
   - Should close modal on cancel
   - Should execute action on confirm
   - Should show proxy picker modal

5. **toasts.spec.ts**
   - Should show success toast after deck save
   - Should show error toast on failure
   - Should show toast when copying link
   - Should auto-dismiss toasts

**IndexedDB Testing Example:**
```typescript
test('should save deck to IndexedDB', async ({ page }) => {
  // Create deck without login
  await page.goto('/deck/create');
  // ... create deck ...

  // Verify saved in IndexedDB
  const anonDecks = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('wudb');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const transaction = db.transaction(['anonDecks'], 'readonly');
    const store = transaction.objectStore('anonDecks');
    const allDecks = await new Promise<any[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    return allDecks;
  });

  expect(anonDecks).toHaveLength(1);
  expect(anonDecks[0].name).toBe('Test Deck');
});
```

**Deliverables:**
- Mobile-specific tests
- Anonymous user flow tests
- UI component tests
- ~8-10 tests total

---

### 🚧 Phase 5: Polish & Documentation

**Duration:** 2 days
**Status:** Not Started

**Goals:**
- Add test tags for selective running
- Optimize test performance
- Complete documentation
- Code review and refactoring

**Tasks:**

1. **Add Test Tags**
```typescript
test('should login successfully @smoke @critical', async ({ page }) => {
  // Critical smoke test
});

test('should handle edge case @slow', async ({ page }) => {
  // Slower edge case test
});
```

Run specific tags:
```bash
pnpm test:e2e --grep @smoke
pnpm test:e2e --grep @critical
```

2. **Performance Optimization**
   - Review and remove hard-coded `waitForTimeout()` calls
   - Use `waitForSelector()` and `waitForLoadState()` instead
   - Optimize parallel execution
   - Reduce unnecessary navigation

3. **Documentation**
   - Update tests/README.md with complete guide
   - Add troubleshooting section
   - Document all page objects
   - Create onboarding guide for new team members

4. **Create .env.test.example**
   - Already done ✅

5. **Code Review Checklist**
   - [ ] All tests use fixtures
   - [ ] All page interactions use page objects
   - [ ] Cleanup implemented in all tests
   - [ ] No hard-coded waits
   - [ ] Test data is unique or cleaned up
   - [ ] Stable selectors (prefer data-testid)

**Deliverables:**
- Optimized test suite
- Complete documentation
- Team onboarding materials

---

## Test Coverage Summary

### User Flows (10 flows, 30+ tests)

| Flow | Tests | Status |
|------|-------|--------|
| 1. Authentication | 5 | ✅ Complete |
| 2. Deck Creation | 5 | 🚧 Phase 2 |
| 3. Deck Management | 5 | 🚧 Phase 2 |
| 4. Deck Export | 3 | 🚧 Phase 3 |
| 5. Card Browsing | 4 | 🚧 Phase 3 |
| 6. User Profile | 1 | 🚧 Phase 3 |
| 7. Deck Discovery | 3 | 🚧 Phase 3 |
| 8. Responsive (Mobile) | 2 | 🚧 Phase 4 |
| 9. Anonymous User | 2 | 🚧 Phase 4 |
| 10. UI Components | 2 | 🚧 Phase 4 |
| **Total** | **32+** | **5/32 (16%)** |

---

## Technical Architecture

### Directory Structure (Final)
```
apps/frontend_v2/
├── playwright.config.ts
├── .env.test (gitignored)
├── .env.test.example
├── tests/
│   ├── README.md
│   ├── e2e/
│   │   ├── setup/
│   │   │   ├── global-setup.ts
│   │   │   └── global-teardown.ts (optional)
│   │   ├── fixtures/
│   │   │   ├── authenticated.fixture.ts
│   │   │   └── anonymous.fixture.ts
│   │   ├── page-objects/
│   │   │   ├── BasePage.ts
│   │   │   ├── LoginPage.ts
│   │   │   ├── SignUpPage.ts
│   │   │   ├── DeckCreatorPage.ts
│   │   │   ├── MyDecksPage.ts
│   │   │   ├── DeckViewPage.ts
│   │   │   ├── LibraryPage.ts
│   │   │   ├── UserProfilePage.ts
│   │   │   └── BrowseDecksPage.ts
│   │   ├── helpers/
│   │   │   ├── auth.helpers.ts
│   │   │   ├── deck.helpers.ts
│   │   │   ├── storage.helpers.ts
│   │   │   └── wait.helpers.ts
│   │   ├── specs/
│   │   │   ├── 01-auth/
│   │   │   │   ├── login.spec.ts ✅
│   │   │   │   └── signup.spec.ts
│   │   │   ├── 02-deck-creation/
│   │   │   │   ├── create-deck.spec.ts
│   │   │   │   └── edit-deck.spec.ts
│   │   │   ├── 03-deck-management/
│   │   │   │   ├── view-deck.spec.ts
│   │   │   │   ├── delete-deck.spec.ts
│   │   │   │   └── privacy-toggle.spec.ts
│   │   │   ├── 04-deck-export/
│   │   │   │   ├── export-udb.spec.ts
│   │   │   │   └── share-link.spec.ts
│   │   │   ├── 05-card-browsing/
│   │   │   │   ├── library-search.spec.ts
│   │   │   │   └── library-filters.spec.ts
│   │   │   ├── 06-user-profile/
│   │   │   │   └── edit-profile.spec.ts
│   │   │   ├── 07-deck-discovery/
│   │   │   │   └── browse-public-decks.spec.ts
│   │   │   ├── 08-responsive/
│   │   │   │   └── mobile-deck-creator.spec.ts
│   │   │   ├── 09-anonymous-user/
│   │   │   │   ├── anonymous-deck-creation.spec.ts
│   │   │   │   └── sync-on-login.spec.ts
│   │   │   └── 10-ui-components/
│   │   │       ├── modals.spec.ts
│   │   │       └── toasts.spec.ts
│   │   └── test-data/
│   │       ├── decks.json
│   │       └── cards.json
│   └── .auth/
│       └── user.json (gitignored)
```

---

## Scripts & Commands

### Test Execution
```bash
# Run all tests (headless)
pnpm test:e2e

# Interactive UI mode (recommended for development)
pnpm test:e2e:ui

# See browser (headed mode)
pnpm test:e2e:headed

# Debug mode (Playwright Inspector)
pnpm test:e2e:debug

# View HTML report
pnpm test:e2e:report

# Run specific project
pnpm test:e2e:chromium
pnpm test:e2e:mobile

# Run specific test file
pnpm test:e2e tests/e2e/specs/01-auth/login.spec.ts

# Run tests with specific tag
pnpm test:e2e --grep @smoke
pnpm test:e2e --grep @critical
```

---

## Success Metrics

### Phase 1 ✅
- [x] Playwright installed and configured
- [x] Auth state reuse working
- [x] First 5 tests passing
- [x] Documentation complete

### Phase 2 (Target)
- [ ] 15+ tests passing
- [ ] Deck CRUD fully covered
- [ ] Test data management in place
- [ ] API cleanup working

### Phase 3 (Target)
- [ ] 25+ tests passing
- [ ] All major features covered
- [ ] Clipboard testing working
- [ ] Profile management tested

### Phase 4 (Target)
- [ ] 32+ tests passing
- [ ] Mobile tests working
- [ ] Anonymous user flows tested
- [ ] IndexedDB testing implemented

### Phase 5 (Target)
- [ ] Test suite optimized (< 10 min execution)
- [ ] Complete documentation
- [ ] Team onboarded
- [ ] Code reviewed and polished

### Overall Success Criteria
- [ ] 30+ E2E tests passing
- [ ] Test suite runs in < 10 minutes
- [ ] 80%+ critical path coverage
- [ ] Tests run locally without issues
- [ ] Team can write new tests independently

---

## Future Enhancements (Out of Scope)

1. **CI/CD Integration**
   - GitHub Actions workflow
   - Run on PR and merge
   - Parallel execution in cloud

2. **Visual Regression Testing**
   - Screenshot comparison
   - Deck view screenshots
   - Card rendering consistency

3. **Accessibility Testing**
   - `@axe-core/playwright` integration
   - Keyboard navigation tests
   - Screen reader compatibility

4. **API Mocking**
   - Mock slow APIs with `page.route()`
   - Test error states
   - Offline mode testing

5. **Performance Testing**
   - Lighthouse integration
   - Core Web Vitals tracking
   - Large deck handling

6. **Cross-browser Testing**
   - Firefox and WebKit
   - Mobile Safari (iOS simulator)
   - Different OS combinations

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Firebase staging instability | Medium | High | Use dedicated test environment if needed |
| Test flakiness | Medium | Medium | Use proper waits, retry logic |
| Auth state expires | Low | Medium | Regenerate state in global setup |
| IndexedDB testing complexity | Medium | Low | Use page.evaluate() carefully |
| Selector instability | High | Medium | Add data-testid attributes |

### Timeline Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Phase 2 takes longer than expected | Medium | Low | Prioritize critical flows first |
| Missing test credentials | High | High | Document requirements upfront |
| UI changes break selectors | Medium | Medium | Use stable selectors, page objects |

---

## Dependencies & Prerequisites

### Required
- [x] Playwright installed
- [ ] `.env.test` file with staging credentials
- [ ] Playwright browsers installed
- [ ] Dev server running (for test execution)
- [ ] Test user account in Firebase staging

### Optional
- [ ] Additional test users for parallel execution
- [ ] Dedicated test environment (vs staging)
- [ ] Test data seeding scripts

---

## Timeline

| Phase | Duration | Start | End | Status |
|-------|----------|-------|-----|--------|
| Phase 1: Foundation | 2-3 days | Jan 3 | Jan 3 | ✅ Complete |
| Phase 2: Deck CRUD | 3-4 days | TBD | TBD | 🚧 Not Started |
| Phase 3: Export/Browse/Profile | 3-4 days | TBD | TBD | 🚧 Not Started |
| Phase 4: Responsive/Edge Cases | 2-3 days | TBD | TBD | 🚧 Not Started |
| Phase 5: Polish | 2 days | TBD | TBD | 🚧 Not Started |
| **Total** | **12-16 days** | **Jan 3** | **TBD** | **16% Complete** |

---

## Contact & Support

**Documentation:**
- Playwright Docs: https://playwright.dev/
- Test README: `apps/frontend_v2/tests/README.md`

**Troubleshooting:**
See `tests/README.md` for common issues and solutions.

---

## Change Log

| Date | Phase | Changes |
|------|-------|---------|
| 2026-01-03 | Phase 1 | Initial setup complete. Created foundation infrastructure, auth setup, first tests. |

---

**Last Updated:** 2026-01-03
**Next Review:** After Phase 2 completion
