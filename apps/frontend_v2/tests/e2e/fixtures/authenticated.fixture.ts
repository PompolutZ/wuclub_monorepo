import { test as base, expect } from '@playwright/test';

/**
 * Authenticated test fixture
 *
 * Uses the auth state saved during global setup (tests/.auth/user.json)
 * All tests using this fixture will have the user already logged in
 *
 * Usage:
 * ```typescript
 * import { authenticatedTest as test, expect } from '../fixtures/authenticated.fixture';
 *
 * test('view my decks', async ({ page }) => {
 *   // User is already authenticated
 *   await page.goto('/mydecks');
 *   // ... test logic
 * });
 * ```
 */
export const authenticatedTest = base.extend({
  // The storageState is already configured in playwright.config.ts
  // This fixture is just for clarity and can be extended with additional setup
});

// Re-export expect for convenience
export { expect };
