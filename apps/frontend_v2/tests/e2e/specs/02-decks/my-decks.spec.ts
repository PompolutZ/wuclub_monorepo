import { authenticatedTest as test, expect } from '../../fixtures/authenticated.fixture';
import { DeckCreatorPage } from '../../page-objects/DeckCreatorPage';
import { MyDecksPage } from '../../page-objects/MyDecksPage';
import { generateDeckName, getAuthToken, getUserId, clearDeckInProgress } from '../../helpers/deckHelpers';
import { deleteAllUserDecksViaAPI } from '../../helpers/apiHelpers';
import { VALID_OBJECTIVES, VALID_PLOYS, VALID_UPGRADES } from '../../test-data/validDecks';

test.describe('My Decks Page', () => {
  let deckCreatorPage: DeckCreatorPage;
  let myDecksPage: MyDecksPage;

  test.beforeEach(async ({ page }) => {
    deckCreatorPage = new DeckCreatorPage(page);
    myDecksPage = new MyDecksPage(page);

    // Clear deck in progress
    await clearDeckInProgress(page);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Delete all decks via API
    const authToken = await getAuthToken(page);
    const fuid = await getUserId(page);

    if (authToken && fuid) {
      await deleteAllUserDecksViaAPI(authToken, fuid);
    }
  });

  test('should show empty state when no decks exist', async ({ page }) => {
    // Make sure all decks are deleted
    const authToken = await getAuthToken(page);
    const fuid = await getUserId(page);

    if (authToken && fuid) {
      await deleteAllUserDecksViaAPI(authToken, fuid);
    }

    // Navigate to My Decks
    await myDecksPage.navigateToMyDecks();

    // Should show empty state message
    await myDecksPage.assertEmptyState();
  });

  test('should list all user decks', async ({ page }) => {
    // Create 3 decks
    const deckNames: string[] = [];

    for (let i = 0; i < 3; i++) {
      const deckName = generateDeckName(`Test Deck ${i + 1}`);
      deckNames.push(deckName);

      await deckCreatorPage.navigateToDeckCreator();
      await deckCreatorPage.addCardsById(VALID_OBJECTIVES, "objective");
      await deckCreatorPage.addCardsById(VALID_PLOYS, "ploy");
      await deckCreatorPage.addCardsById(VALID_UPGRADES, "upgrade");
      await deckCreatorPage.setDeckName(deckName);
      await deckCreatorPage.saveDeck();
      await deckCreatorPage.waitForDeckToSave();
    }

    // Navigate to My Decks
    await myDecksPage.navigateToMyDecks();

    // All 3 decks should be visible
    for (const deckName of deckNames) {
      await myDecksPage.assertDeckExists(deckName);
    }

    // Deck count should be at least 3
    const deckCount = await myDecksPage.getDeckCount();
    expect(deckCount).toBeGreaterThanOrEqual(3);
  });

  test('should sort decks by updated date (newest first)', async ({ page }) => {
    // Create first deck
    const deck1Name = generateDeckName('Older Deck');
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(deck1Name);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Wait a bit to ensure different timestamps
    await page.waitForTimeout(1500);

    // Create second deck
    const deck2Name = generateDeckName('Newer Deck');
    await deckCreatorPage.navigateToDeckCreator();
    await deckCreatorPage.addCardsById(VALID_OBJECTIVES);
    await deckCreatorPage.addCardsById(VALID_PLOYS);
    await deckCreatorPage.addCardsById(VALID_UPGRADES);
    await deckCreatorPage.setDeckName(deck2Name);
    await deckCreatorPage.saveDeck();
    await deckCreatorPage.waitForDeckToSave();

    // Navigate to My Decks
    await myDecksPage.navigateToMyDecks();

    // Both decks should exist
    await myDecksPage.assertDeckExists(deck1Name);
    await myDecksPage.assertDeckExists(deck2Name);

    // Newer deck should appear first (higher in the list)
    // We can verify by checking the order of elements
    const deck1Element = page.locator(`text="${deck1Name}"`).first();
    const deck2Element = page.locator(`text="${deck2Name}"`).first();

    const deck1Box = await deck1Element.boundingBox();
    const deck2Box = await deck2Element.boundingBox();

    // Newer deck should have smaller Y coordinate (higher on page)
    if (deck1Box && deck2Box) {
      expect(deck2Box.y).toBeLessThan(deck1Box.y);
    }
  });
});
