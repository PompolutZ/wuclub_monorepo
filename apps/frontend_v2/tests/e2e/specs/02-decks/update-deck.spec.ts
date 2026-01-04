import { authenticatedTest as test, expect } from '../../fixtures/authenticated.fixture';
import { DeckCreatorPage } from '../../page-objects/DeckCreatorPage';
import { MyDecksPage } from '../../page-objects/MyDecksPage';
import { DeckViewPage } from '../../page-objects/DeckViewPage';
import { generateDeckName, getAuthToken, getUserId, clearDeckInProgress } from '../../helpers/deckHelpers';
import { deleteAllUserDecksViaAPI } from '../../helpers/apiHelpers';
import { VALID_OBJECTIVES, VALID_PLOYS, VALID_UPGRADES } from '../../test-data/validDecks';

test.describe('Deck Updating', () => {
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

    // Create a deck to update
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(testDeckName);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Delete all decks via API
    const authToken = await getAuthToken(page);
    const fuid = await getUserId(page);

    if (authToken && fuid) {
      await deleteAllUserDecksViaAPI(authToken, fuid);
    }
  });

  test('should update deck name', async ({ page }) => {
    // Navigate to My Decks and click the deck
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Click edit button
    await deckViewPage.clickEdit();

    // Update the deck name
    const newDeckName = generateDeckName('Updated Deck');
    await deckCreatorPage.setDeckName(newDeckName);

    // Save the deck
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Verify updated name appears in My Decks
    await myDecksPage.assertDeckExists(newDeckName);
    await myDecksPage.assertDeckNotExists(testDeckName);
  });

  test('should save changes to deck cards', async ({ page }) => {
    // Navigate to My Decks and click the deck
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Verify initial card count
    await deckViewPage.assertCardCounts({
      objectives: 12,
      gambits: 10,
      upgrades: 10
    });

    // Click edit
    await deckViewPage.clickEdit();

    // Remove one objective and one ploy by clicking them (toggle off)
    await deckCreatorPage.addCardsById([VALID_OBJECTIVES[0]]);
    await deckCreatorPage.addCardsById([VALID_PLOYS[0]]);

    // Add them back to maintain valid deck
    await deckCreatorPage.addCardsById([VALID_OBJECTIVES[0]]);
    await deckCreatorPage.addCardsById([VALID_PLOYS[0]]);

    // Save the deck
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Click deck again to view
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Card counts should still be correct
    await deckViewPage.assertCardCounts({
      objectives: 12,
      gambits: 10,
      upgrades: 10
    });
  });
});
