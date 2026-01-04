import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for My Decks page
 * Handles deck listing, deletion at /mydecks
 */
export class MyDecksPage extends BasePage {
  /**
   * Navigate to My Decks page
   */
  async navigateToMyDecks() {
    await this.goto('/mydecks');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get a deck element by deck name
   */
  private getDeckByName(deckName: string): Locator {
    return this.page.locator(`text="${deckName}"`).first();
  }

  /**
   * Get the delete button for a specific deck
   * Looks for the trash icon button near the deck name
   */
  private getDeleteButton(deckName: string): Locator {
    // Find the deck container, then find the delete button within it
    const deckContainer = this.page.locator('div').filter({ hasText: deckName }).first();
    return deckContainer.locator('button').filter({ has: this.page.locator('svg') }).last();
  }

  /**
   * Get the delete confirmation dialog
   */
  private get deleteConfirmDialog(): Locator {
    return this.page.locator('div[role="dialog"], div:has-text("Delete deck")');
  }

  /**
   * Get the confirm delete button in the dialog
   */
  private get confirmDeleteButton(): Locator {
    // Look for button with text like "Delete" or "Confirm"
    return this.page.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
  }

  /**
   * Get the cancel button in the dialog
   */
  private get cancelDeleteButton(): Locator {
    return this.page.locator('button:has-text("Cancel")').first();
  }

  /**
   * Get the empty state message
   */
  private get emptyStateMessage(): Locator {
    return this.page.getByText('You don\'t have any decks yet');
  }

  /**
   * Click on a deck to navigate to its view page
   */
  async clickDeck(deckName: string) {
    const deck = this.getDeckByName(deckName);
    await deck.click();
  }

  /**
   * Assert that a deck exists in the list
   */
  async assertDeckExists(deckName: string) {
    const deck = this.getDeckByName(deckName);
    await expect(deck).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert that a deck does not exist in the list
   */
  async assertDeckNotExists(deckName: string) {
    const deck = this.getDeckByName(deckName);
    await expect(deck).not.toBeVisible();
  }

  /**
   * Get the number of decks displayed
   */
  async getDeckCount(): Promise<number> {
    // Count deck link elements (each deck should have unique structure)
    // This is a heuristic - adjust based on actual DOM structure
    await this.page.waitForTimeout(1000); // Wait for decks to load

    const emptyState = await this.emptyStateMessage.isVisible().catch(() => false);
    if (emptyState) {
      return 0;
    }

    // Count deck containers (they have faction pictures and deck names)
    const deckElements = this.page.locator('div').filter({
      has: this.page.locator('img[alt*="faction"], img[src*="faction"]')
    });

    return await deckElements.count();
  }

  /**
   * Click the delete button for a specific deck
   */
  async clickDeleteDeck(deckName: string) {
    const deleteBtn = this.getDeleteButton(deckName);
    await deleteBtn.click();
    // Wait for dialog to appear
    await this.waitForElement(this.deleteConfirmDialog);
  }

  /**
   * Confirm deletion in the dialog
   */
  async confirmDelete() {
    await this.confirmDeleteButton.click();
    // Wait for dialog to close
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancel deletion in the dialog
   */
  async cancelDelete() {
    await this.cancelDeleteButton.click();
    // Wait for dialog to close
    await this.page.waitForTimeout(500);
  }

  /**
   * Assert that the empty state is shown
   */
  async assertEmptyState() {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  /**
   * Wait for a deck to appear in the list
   */
  async waitForDeckToAppear(deckName: string, timeout = 10000) {
    const deck = this.getDeckByName(deckName);
    await expect(deck).toBeVisible({ timeout });
  }

  /**
   * Check if a deck shows "PUBLIC" privacy indicator
   */
  async getDeckPrivacyStatus(deckName: string): Promise<boolean> {
    const deckContainer = this.page.locator('div').filter({ hasText: deckName }).first();
    const publicIndicator = deckContainer.locator('text="PUBLIC"');
    return await publicIndicator.isVisible().catch(() => false);
  }

  /**
   * Assert deck is marked as public
   */
  async assertDeckIsPublic(deckName: string) {
    const isPublic = await this.getDeckPrivacyStatus(deckName);
    expect(isPublic).toBeTruthy();
  }

  /**
   * Assert deck is marked as private (no PUBLIC indicator)
   */
  async assertDeckIsPrivate(deckName: string) {
    const isPublic = await this.getDeckPrivacyStatus(deckName);
    expect(isPublic).toBeFalsy();
  }
}
