import { authenticatedTest as test, expect } from '../../fixtures/authenticated.fixture';
import { DeckCreatorPage } from '../../page-objects/DeckCreatorPage';
import { MyDecksPage } from '../../page-objects/MyDecksPage';
import { generateDeckName, getAuthToken, getUserId, clearDeckInProgress } from '../../helpers/deckHelpers';
import { deleteAllUserDecksViaAPI } from '../../helpers/apiHelpers';
import { VALID_OBJECTIVES, VALID_PLOYS, VALID_UPGRADES } from '../../test-data/validDecks';

test.describe('Deck Creation', () => {
  let deckCreatorPage: DeckCreatorPage;
  let myDecksPage: MyDecksPage;
  let testDeckName: string;

  test.beforeEach(async ({ page }) => {
    deckCreatorPage = new DeckCreatorPage(page);
    myDecksPage = new MyDecksPage(page);
    testDeckName = generateDeckName();

    // Clear deck in progress from localStorage
    await clearDeckInProgress(page);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Delete all decks created during test via API
    const authToken = await getAuthToken(page);
    const fuid = await getUserId(page);

    if (authToken && fuid) {
      await deleteAllUserDecksViaAPI(authToken, fuid);
    }
  });

  test('should create a valid deck with 32 cards', async ({ page }) => {
    // Navigate to deck creator
    await deckCreatorPage.navigateToDeckCreator();

    // Add 12 objectives
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES, "objective");

    // Add 10 ploys
    await deckCreatorPage.addCardsById(VALID_PLOYS, "ploy");

    // Add 10 upgrades
    await deckCreatorPage.addCardsById(VALID_UPGRADES, "upgrade");

    // Verify we have 32 cards
    const cardCount = await deckCreatorPage.getDeckCardCount();
    expect(cardCount).toBe(32);

    // Set deck name
    await deckCreatorPage.setDeckName(testDeckName);

    // Deck should be valid
    await deckCreatorPage.assertDeckIsValid();

    // Save deck
    await deckCreatorPage.saveDeck();

    // Wait for redirect to /mydecks
    await deckCreatorPage.waitForDeckToSave();

    // Verify deck appears in My Decks
    await myDecksPage.assertDeckExists(testDeckName);
  });

  test('should prevent saving deck with too few cards', async ({ page }) => {
    // Navigate to deck creator
    await deckCreatorPage.navigateToDeckCreator();

    // Add only 6 objectives (need at least 12)
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES.slice(0, 6));

    // Add only 5 ploys (need at least 20 power cards total)
    await deckCreatorPage.addCardsById(VALID_PLOYS.slice(0, 5));

    // Add only 5 upgrades
    await deckCreatorPage.addCardsById(VALID_UPGRADES.slice(0, 5));

    // Set deck name
    await deckCreatorPage.setDeckName(testDeckName);

    // Deck should have validation issues
    await deckCreatorPage.assertDeckHasValidationIssues();

    // Should have issue about too few cards
    await deckCreatorPage.assertValidationIssueExists('at least');
  });

  test('should allow removing cards from deck', async ({ page }) => {
    // Navigate to deck creator
    await deckCreatorPage.navigateToDeckCreator();

    // Add some objectives
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES.slice(0, 12));

    // Verify cards were added
    let cardCount = await deckCreatorPage.getDeckCardCount();
    expect(cardCount).toBe(12);

    // Remove a card by clicking it again (toggle)
    await deckCreatorPage.addCardsById([VALID_OBJECTIVES[0]]);

    // Card count should decrease
    cardCount = await deckCreatorPage.getDeckCardCount();
    expect(cardCount).toBe(11);
  });

  test('should persist deck name', async ({ page }) => {
    // Navigate to deck creator
    await deckCreatorPage.navigateToDeckCreator();

    // Set deck name
    await deckCreatorPage.setDeckName(testDeckName);

    // Add valid deck
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);

    // Save deck
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Verify deck with correct name appears
    await myDecksPage.assertDeckExists(testDeckName);
  });

  test('should clear deck on reset', async ({ page }) => {
    // Navigate to deck creator
    await deckCreatorPage.navigateToDeckCreator();

    // Add some cards
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES.slice(0, 6));

    // Verify cards were added
    let cardCount = await deckCreatorPage.getDeckCardCount();
    expect(cardCount).toBe(6);

    // Click reset
    await deckCreatorPage.resetDeck();

    // Wait for the confirmation and accept it (if dialog appears)
    // Note: This may require clicking a confirmation button
    await page.waitForTimeout(500);

    // Try to click confirm button if dialog appears
    const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Clear")').first();
    const isVisible = await confirmButton.isVisible().catch(() => false);
    if (isVisible) {
      await confirmButton.click();
      await page.waitForTimeout(500);
    }

    // Deck should be empty
    cardCount = await deckCreatorPage.getDeckCardCount();
    expect(cardCount).toBe(0);
  });
});
