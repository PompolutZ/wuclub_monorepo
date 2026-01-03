import { test as base, expect } from '@playwright/test';

/**
 * Anonymous user test fixture
 *
 * Creates a test context without any authentication state
 * Useful for testing anonymous user flows (deck creation without login, etc.)
 *
 * Usage:
 * ```typescript
 * import { anonymousTest as test, expect } from '../fixtures/anonymous.fixture';
 *
 * test('create deck as anonymous user', async ({ page }) => {
 *   // User is NOT authenticated
 *   await page.goto('/deck/create');
 *   // ... test anonymous flow
 * });
 * ```
 */
export const anonymousTest = base.extend({
  // Override storageState to start with no auth
  storageState: async ({}, use) => {
    await use(undefined); // No storage state = anonymous user
  },
});

// Re-export expect for convenience
export { expect };
