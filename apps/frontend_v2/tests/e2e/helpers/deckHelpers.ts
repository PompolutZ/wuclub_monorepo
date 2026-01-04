import { Page } from '@playwright/test';

/**
 * Generate a unique deck name with timestamp
 * @param prefix - Optional prefix for the deck name
 * @returns Unique deck name string
 */
export function generateDeckName(prefix = 'Test Deck'): string {
  return `${prefix} ${Date.now()}`;
}

/**
 * Create a valid deck configuration (12 objectives, 10 ploys, 10 upgrades = 32 cards total)
 * Uses universal cards that work for any faction
 * @returns Object with arrays of card IDs
 */
export function createValidDeckConfig(): {
  objectives: string[];
  ploys: string[];
  upgrades: string[];
} {
  return {
    // 12 objectives (6 Surge + 6 End phase)
    objectives: [
      'BL1', 'BL2', 'BL3', 'BL4', 'BL5', 'BL6',  // 6 Surge
      'BL7', 'BL8', 'ES7', 'ES8', 'ES9', 'ES10'  // 6 End phase
    ],
    // 10 ploys
    ploys: [
      'BL13', 'BL14', 'BL15', 'BL16', 'BL17',
      'BL18', 'BL19', 'BL20', 'BL21', 'BL22'
    ],
    // 10 upgrades
    upgrades: [
      'BL23', 'BL24', 'BL25', 'BL26', 'BL27',
      'BL28', 'BL29', 'BL30', 'BL31', 'BL32'
    ]
  };
}

/**
 * Get the Firebase auth token from localStorage
 * @param page - Playwright page instance
 * @returns Auth token string or null if not found
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  try {
    return await page.evaluate(() => {
      const authData = localStorage.getItem('yawudb_authUser');
      if (!authData) return null;

      try {
        const parsed = JSON.parse(authData);
        return parsed.token || null;
      } catch {
        return null;
      }
    });
  } catch (error) {
    // localStorage not accessible (e.g., page not loaded yet)
    return null;
  }
}

/**
 * Get the Firebase user ID (fuid) from localStorage
 * @param page - Playwright page instance
 * @returns User ID string or null if not found
 */
export async function getUserId(page: Page): Promise<string | null> {
  try {
    return await page.evaluate(() => {
      const authData = localStorage.getItem('yawudb_authUser');
      if (!authData) return null;
      try {
        const parsed = JSON.parse(authData);
        return parsed.uid || null;
      } catch {
        return null;
      }
    });
  } catch (error) {
    // localStorage not accessible (e.g., page not loaded yet)
    return null;
  }
}

/**
 * Clear the deck in progress from localStorage
 * @param page - Playwright page instance
 */
export async function clearDeckInProgress(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      localStorage.removeItem('wunderworlds_deck_in_progress');
    });
  } catch (error) {
    // localStorage not accessible (e.g., page not loaded yet), ignore
  }
}
