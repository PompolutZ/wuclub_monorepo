# E2E Testing with Playwright

This directory contains end-to-end tests for the WUnderworlds frontend application using [Playwright](https://playwright.dev/).

## Setup

### 1. Install Dependencies

Dependencies are already installed if you've run `pnpm install` at the project root. If you need to install Playwright browsers:

```bash
cd apps/frontend_v2
pnpm exec playwright install --with-deps
```

### 2. Configure Test Environment

Create a `.env.test` file in the `apps/frontend_v2` directory:

```bash
cp .env.test.example .env.test
```

Then fill in the staging Firebase credentials and test user credentials. You'll need:
- Firebase staging project credentials (from Firebase console)
- A dedicated test user account in Firebase Authentication

### 3. Start the Dev Server

Tests run against the local Vite dev server. Start it in a separate terminal:

```bash
cd apps/frontend_v2
pnpm dev
```

The server should be running on `http://localhost:5173`.

## Running Tests

### Run All Tests (Headless)

```bash
pnpm test:e2e
```

### Run Tests with UI Mode (Interactive)

```bash
pnpm test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
pnpm test:e2e:headed
```

### Debug Tests

```bash
pnpm test:e2e:debug
```

### Run Specific Project

```bash
pnpm test:e2e:chromium    # Desktop Chrome only
pnpm test:e2e:mobile      # Mobile viewport only
```

### View Test Report

After running tests, view the HTML report:

```bash
pnpm test:e2e:report
```

## Project Structure

```
tests/
├── e2e/
│   ├── setup/
│   │   └── global-setup.ts              # One-time auth setup
│   ├── fixtures/
│   │   ├── authenticated.fixture.ts     # Logged-in user tests
│   │   └── anonymous.fixture.ts         # Anonymous user tests
│   ├── page-objects/
│   │   ├── BasePage.ts                  # Base class for page objects
│   │   └── LoginPage.ts                 # Login page interactions
│   ├── helpers/
│   │   └── (helper utilities)
│   ├── specs/
│   │   └── 01-auth/
│   │       └── login.spec.ts            # Login tests
│   └── test-data/
│       └── (test data files)
└── .auth/
    └── user.json                        # Saved auth state (gitignored)
```

## Writing Tests

### Using Authenticated Fixture

Most tests should use the authenticated fixture, which reuses the auth state from global setup:

```typescript
import { authenticatedTest as test, expect } from '../fixtures/authenticated.fixture';
import { MyDecksPage } from '../page-objects/MyDecksPage';

test('should display user decks', async ({ page }) => {
  // User is already logged in
  const myDecksPage = new MyDecksPage(page);
  await myDecksPage.goto('/mydecks');

  // Test logic here
});
```

### Using Anonymous Fixture

For testing flows without authentication:

```typescript
import { anonymousTest as test, expect } from '../fixtures/anonymous.fixture';

test('should allow deck creation without login', async ({ page }) => {
  // User is NOT authenticated
  await page.goto('/deck/create');

  // Test anonymous flow
});
```

### Page Object Model

All page interactions should go through Page Objects:

```typescript
// page-objects/MyNewPage.ts
import { BasePage } from './BasePage';

export class MyNewPage extends BasePage {
  private get myButton() {
    return this.page.locator('button#my-button');
  }

  async clickMyButton() {
    await this.myButton.click();
  }

  async assertMyButtonVisible() {
    await expect(this.myButton).toBeVisible();
  }
}
```

## Troubleshooting

### Tests failing with "user.json not found"

The global setup needs to run first to create the auth state. This happens automatically when you run `pnpm test:e2e`. If it fails:

1. Check that `.env.test` exists with valid credentials
2. Check that the dev server is running on `http://localhost:5173`
3. Verify the test user credentials are correct in Firebase

### Tests timing out

- Ensure the dev server is running
- Check network connectivity to Firebase
- Increase timeout in `playwright.config.ts` if needed

### Auth state not working

Delete the saved auth state and let it recreate:

```bash
rm tests/.auth/user.json
pnpm test:e2e
```

### "Cannot find module" errors

Make sure you've installed dependencies:

```bash
pnpm install
pnpm exec playwright install
```

## Best Practices

1. **Use Page Objects** - Never use raw locators in test files
2. **Use Fixtures** - Always extend from `authenticatedTest` or `anonymousTest`
3. **Unique Test Data** - Generate unique names for test decks/users to avoid collisions
4. **Clean Up** - Delete test data in `afterEach` hooks
5. **Avoid Hard Waits** - Use `waitFor` methods instead of `page.waitForTimeout()`
6. **Stable Selectors** - Prefer data-testid attributes over CSS classes

## Current Test Coverage

- ✅ Authentication (login)
- 🚧 Deck creation (Phase 2)
- 🚧 Deck management (Phase 2)
- 🚧 Card browsing (Phase 3)
- 🚧 Export features (Phase 3)
- 🚧 Profile management (Phase 3)
- 🚧 Mobile testing (Phase 4)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
