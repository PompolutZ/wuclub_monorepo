import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Deck View page
 * Handles read-only deck viewing at /view/deck/:id
 */
export class DeckViewPage extends BasePage {
  /**
   * Navigate to a specific deck view
   */
  async navigateToDeck(deckId: string) {
    await this.goto(`/view/deck/${deckId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the deck name heading
   */
  private get deckNameHeading(): Locator {
    return this.page.locator('h1, h2, h3').first();
  }

  /**
   * Get the edit button
   */
  private get editButton(): Locator {
    return this.page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
  }

  /**
   * Get the delete button
   */
  private get deleteButton(): Locator {
    // Delete button typically has a trash icon
    return this.page.locator('button').filter({
      has: this.page.locator('svg')
    }).filter({
      hasText: /delete/i
    }).or(this.page.locator('button[aria-label*="delete" i]')).first();
  }

  /**
   * Get the privacy toggle button
   */
  private get privacyToggleButton(): Locator {
    // Privacy toggle shows PersonIcon or PeopleIcon
    return this.page.locator('button').filter({
      hasText: /make (public|private)/i
    }).first();
  }

  /**
   * Get the delete confirmation dialog
   */
  private get deleteConfirmDialog(): Locator {
    return this.page.locator('div[role="dialog"], div:has-text("Delete deck")');
  }

  /**
   * Get the confirm delete button
   */
  private get confirmDeleteButton(): Locator {
    return this.page.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
  }

  /**
   * Assert the deck name matches expected value
   */
  async assertDeckName(expectedName: string) {
    const deckName = await this.deckNameHeading.textContent();
    expect(deckName).toContain(expectedName);
  }

  /**
   * Click the edit button
   */
  async clickEdit() {
    await this.editButton.click();
    // Wait for navigation to edit page
    await this.page.waitForURL(/\/deck\/edit\//, { timeout: 10000 });
  }

  /**
   * Click the delete button
   */
  async clickDelete() {
    await this.deleteButton.click();
    // Wait for confirmation dialog
    await this.waitForElement(this.deleteConfirmDialog);
  }

  /**
   * Confirm deletion in the dialog
   */
  async confirmDelete() {
    await this.confirmDeleteButton.click();
    // Wait for redirect to /mydecks
    await this.page.waitForTimeout(500);
  }

  /**
   * Toggle the privacy setting
   */
  async togglePrivacy() {
    await this.privacyToggleButton.click();
    // Wait for toggle to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * Assert the privacy status of the deck
   * @param isPublic - true if deck should be public, false if private
   */
  async assertPrivacyStatus(isPublic: boolean) {
    if (isPublic) {
      // Should see "Make private" button
      await expect(this.privacyToggleButton).toHaveText(/make private/i);
    } else {
      // Should see "Make public" button
      await expect(this.privacyToggleButton).toHaveText(/make public/i);
    }
  }

  /**
   * Assert that edit button is visible
   */
  async assertEditButtonVisible() {
    await expect(this.editButton).toBeVisible();
  }

  /**
   * Assert that delete button is visible
   */
  async assertDeleteButtonVisible() {
    await expect(this.deleteButton).toBeVisible();
  }

  /**
   * Assert that privacy toggle is visible
   */
  async assertPrivacyToggleVisible() {
    await expect(this.privacyToggleButton).toBeVisible();
  }

  /**
   * Get card counts from the deck view
   */
  async getCardCounts(): Promise<{ objectives: number; gambits: number; upgrades: number }> {
    const objectives = await this.page.locator('section:has-text("Objectives") .card, section:has-text("Objectives") [data-card-id]').count();
    const gambits = await this.page.locator('section:has-text("Ploys") .card, section:has-text("Ploys") [data-card-id], section:has-text("Gambits") .card').count();
    const upgrades = await this.page.locator('section:has-text("Upgrades") .card, section:has-text("Upgrades") [data-card-id]').count();

    return { objectives, gambits, upgrades };
  }

  /**
   * Assert specific card counts
   */
  async assertCardCounts(expected: { objectives: number; gambits: number; upgrades: number }) {
    const actual = await this.getCardCounts();
    expect(actual.objectives).toBe(expected.objectives);
    expect(actual.gambits).toBe(expected.gambits);
    expect(actual.upgrades).toBe(expected.upgrades);
  }
}
