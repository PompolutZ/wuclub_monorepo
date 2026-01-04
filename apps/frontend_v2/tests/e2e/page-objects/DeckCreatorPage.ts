import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Deck Creator/Editor
 * Handles deck creation and editing at /deck/create and /deck/edit/:id
 */
export class DeckCreatorPage extends BasePage {
  /**
   * Navigate to the deck creator page
   */
  async navigateToDeckCreator() {
    await this.goto('/deck/create');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to edit an existing deck
   */
  async navigateToEditDeck(deckId: string) {
    await this.goto(`/deck/edit/${deckId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the deck name input field
   */
  private get deckNameInput(): Locator {
    return this.page.locator('input[placeholder*="Deck"]').first();
  }

  /**
   * Get the save button (button with SaveIcon)
   */
  private get saveButton(): Locator {
    return this.page.locator('.flex.flex-1 > .btn.btn-purple');
  }

  /**
   * Get the reset button (button with CloseIcon)
   */
  private get resetButton(): Locator {
    return this.page.locator('button.btn-red').first();
  }

  /**
   * Get the search input for cards
   */
  private get cardSearchInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Search for any text on card' });
  }

  private get cardLibraryObjectivesTab(): Locator {
    // Tab button with objective icon - look for button containing "objective" text
    return this.page.getByRole('button', { name: /objective/i }).first();
  }

  private get cardLibraryPloysTab(): Locator {
    // Tab button with ploy/spell icon - look for button containing "spell" or "ploy" text
    return this.page.getByRole('button', { name: /spell|ploy/i }).first();
  }

  private get cardLibraryUpgradesTab(): Locator {
    // Tab button with upgrade icon - look for button containing "upgrade" text
    return this.page.getByRole('button', { name: /upgrade/i }).first();
  }

  /**
   * Get the validation issues section
   */
  private get validationIssues(): Locator {
    return this.page.locator('section.text-accent3-700 ul li');
  }

  /**
   * Set the deck name
   */
  async setDeckName(name: string) {
    await this.deckNameInput.clear();
    await this.deckNameInput.fill(name);
    // Wait for debounce
    await this.page.waitForTimeout(500);
  }

  /**
   * Search for a card by name
   */
  async searchCard(cardName: string) {
    await this.cardSearchInput.clear();
    await this.cardSearchInput.fill(cardName);
    // Wait for search results to filter
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a card to the deck by clicking on it in the library
   * Note: Card must be visible after search
   */
  async addCardToDeck(cardName: string) {
    // Find card by its name in the library
    const cardElement = this.page.locator('.card, [role="button"]').filter({ hasText: cardName }).first();
    await this.waitForElement(cardElement);
    await cardElement.click();
    // Wait for card to be added
    await this.page.waitForTimeout(300);
  }

  /**
   * Click the save button
   */
  async saveDeck() {
    await this.saveButton.click();
  }

  /**
   * Click the reset button
   */
  async resetDeck() {
    await this.resetButton.click();
  }

  /**
   * Wait for the deck to save and redirect to /mydecks
   */
  async waitForDeckToSave() {
    await this.waitForNavigation('/mydecks', 15000);
  }

  /**
   * Get the total number of cards in the deck
   * Counts objectives + ploys (gambits) + upgrades
   */
  async getDeckCardCount(): Promise<number> {
    // Count cards in the deck sections
    const objectives = await this.page.locator('section:has-text("Objectives") .card, section:has-text("Objectives") [data-card-id]').count();
    const gambits = await this.page.locator('section:has-text("Ploys") .card, section:has-text("Ploys") [data-card-id], section:has-text("Gambits") .card, section:has-text("Gambits") [data-card-id]').count();
    const upgrades = await this.page.locator('section:has-text("Upgrades") .card, section:has-text("Upgrades") [data-card-id]').count();

    return objectives + gambits + upgrades;
  }

  /**
   * Assert that the deck is valid (no validation issues)
   */
  async assertDeckIsValid() {
    const issuesCount = await this.validationIssues.count();
    expect(issuesCount).toBe(0);
  }

  /**
   * Assert that the deck has validation issues
   */
  async assertDeckHasValidationIssues() {
    const issuesCount = await this.validationIssues.count();
    expect(issuesCount).toBeGreaterThan(0);
  }

  /**
   * Get the validation issues as an array of strings
   */
  async getValidationIssues(): Promise<string[]> {
    return await this.validationIssues.allTextContents();
  }

  /**
   * Assert specific validation issue exists
   */
  async assertValidationIssueExists(issueText: string) {
    const issues = await this.getValidationIssues();
    const hasIssue = issues.some(issue => issue.includes(issueText));
    expect(hasIssue).toBeTruthy();
  }

  /**
   * Add multiple cards to deck from a list of card names
   * This is more efficient than searching for each card individually
   */
  async addCardsById(cardNames: string[], type: 'objective' | 'ploy' | 'upgrade' = 'objective') {
    // Click the appropriate tab first
    switch (type) {
      case 'objective':
        await this.cardLibraryObjectivesTab.click();
        break;
      case 'ploy':
        await this.cardLibraryPloysTab.click();
        break;
      case 'upgrade':
        await this.cardLibraryUpgradesTab.click();
        break;
    }
    await this.page.waitForTimeout(300);

    for (const cardName of cardNames) {
      // Search by card name
      await this.cardSearchInput.clear();
      await this.cardSearchInput.fill(cardName);
      await this.page.waitForTimeout(500); // Wait for search to filter

      // Find the card row by card name, then find its add/remove button
      // Card row contains the card name and has a button with either btn-purple (add) or btn-red (remove)
      const cardRow = this.page.locator('div').filter({ hasText: cardName }).first();
      const toggleButton = cardRow.locator('button.btn-purple, button.btn-red').first();

      await toggleButton.waitFor({ state: 'visible', timeout: 5000 });
      await toggleButton.click();
      await this.page.waitForTimeout(300);
    }

    // Clear search after adding all cards
    await this.cardSearchInput.clear();
    await this.page.waitForTimeout(300);
  }
}
