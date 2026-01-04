import { authenticatedTest as test, expect } from '../../fixtures/authenticated.fixture';
import { DeckCreatorPage } from '../../page-objects/DeckCreatorPage';
import { MyDecksPage } from '../../page-objects/MyDecksPage';
import { DeckViewPage } from '../../page-objects/DeckViewPage';
import { generateDeckName, getAuthToken, getUserId, clearDeckInProgress } from '../../helpers/deckHelpers';
import { deleteAllUserDecksViaAPI } from '../../helpers/apiHelpers';
import { VALID_OBJECTIVES, VALID_PLOYS, VALID_UPGRADES } from '../../test-data/validDecks';

test.describe('Deck Deletion', () => {
  let deckCreatorPage: DeckCreatorPage;
  let myDecksPage: MyDecksPage;
  let deckViewPage: DeckViewPage;
  let testDeckName: string;

  test.beforeEach(async ({ page }) => {
    deckCreatorPage = new DeckCreatorPage(page);
    myDecksPage = new MyDecksPage(page);
    deckViewPage = new DeckViewPage(page);
    testDeckName = generateDeckName();

    // Clear deck in progress
    await clearDeckInProgress(page);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Delete all remaining decks via API
    const authToken = await getAuthToken(page);
    const fuid = await getUserId(page);

    if (authToken && fuid) {
      await deleteAllUserDecksViaAPI(authToken, fuid);
    }
  });

  test('should delete deck from My Decks page', async ({ page }) => {
    // Create a deck
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(testDeckName);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Verify deck exists
    await myDecksPage.assertDeckExists(testDeckName);

    // Click delete button
    await myDecksPage.clickDeleteDeck(testDeckName);

    // Confirm deletion
    await myDecksPage.confirmDelete();

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Deck should no longer exist
    await myDecksPage.assertDeckNotExists(testDeckName);
  });

  test('should delete deck from Deck View page', async ({ page }) => {
    // Create a deck
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(testDeckName);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Navigate to deck view
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Click delete button
    await deckViewPage.clickDelete();

    // Confirm deletion
    await deckViewPage.confirmDelete();

    // Should redirect to /mydecks
    await page.waitForURL(/\/mydecks/, { timeout: 10000 });

    // Deck should not exist
    await myDecksPage.assertDeckNotExists(testDeckName);
  });

  test('should cancel deck deletion', async ({ page }) => {
    // Create a deck
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(testDeckName);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Click delete button
    await myDecksPage.clickDeleteDeck(testDeckName);

    // Cancel deletion
    await myDecksPage.cancelDelete();

    // Deck should still exist
    await myDecksPage.assertDeckExists(testDeckName);
  });
});
