import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object
 *
 * Parent class for all page objects, providing common functionality
 * All page-specific page objects should extend this class
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string) {
    await this.page.goto(path);
  }

  /**
   * Wait for navigation to a specific URL
   */
  async waitForNavigation(url: string | RegExp, timeout = 10000) {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for React Query to finish loading
   */
  async waitForReactQueryToSettle() {
    await this.page.waitForFunction(
      () => {
        // Check for loading indicators
        const loadingIndicators = document.querySelectorAll('[data-loading="true"]');
        return loadingIndicators.length === 0;
      },
      { timeout: 10000 }
    );
  }

  /**
   * Clear React Query cache from localStorage
   */
  async clearReactQueryCache() {
    await this.page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('REACT_QUERY'))
        .forEach((key) => localStorage.removeItem(key));
    });
  }

  /**
   * Get value from localStorage
   */
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Clear auth state from localStorage
   */
  async clearAuthState() {
    await this.page.evaluate(() => {
      localStorage.removeItem('yawudb_authUser');
    });
  }
}
