import { authenticatedTest as test, expect } from '../../fixtures/authenticated.fixture';
import { DeckCreatorPage } from '../../page-objects/DeckCreatorPage';
import { MyDecksPage } from '../../page-objects/MyDecksPage';
import { DeckViewPage } from '../../page-objects/DeckViewPage';
import { generateDeckName, getAuthToken, getUserId, clearDeckInProgress } from '../../helpers/deckHelpers';
import { deleteAllUserDecksViaAPI } from '../../helpers/apiHelpers';
import { VALID_OBJECTIVES, VALID_PLOYS, VALID_UPGRADES } from '../../test-data/validDecks';

test.describe('Deck Viewing', () => {
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

    // Create a deck for viewing
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

  test('should display deck details correctly', async ({ page }) => {
    // Click on the deck from My Decks page
    await myDecksPage.clickDeck(testDeckName);

    // Wait for deck view to load
    await page.waitForLoadState('networkidle');

    // Verify deck name is displayed
    await deckViewPage.assertDeckName(testDeckName);

    // Verify card counts
    await deckViewPage.assertCardCounts({
      objectives: 12,
      gambits: 10,
      upgrades: 10
    });
  });

  test('should show edit button for own decks', async ({ page }) => {
    // Navigate to My Decks and click the deck
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Edit button should be visible
    await deckViewPage.assertEditButtonVisible();
  });

  test('should show delete button for own decks', async ({ page }) => {
    // Navigate to My Decks and click the deck
    await myDecksPage.clickDeck(testDeckName);
    await page.waitForLoadState('networkidle');

    // Delete button should be visible (may need to open actions menu on mobile)
    // For now, we'll just check if it exists in the DOM
    const deleteButton = page.locator('button').filter({
      has: page.locator('svg')
    }).filter({
      hasText: /delete/i
    }).or(page.locator('button[aria-label*="delete" i]'));

    const count = await deleteButton.count();
    expect(count).toBeGreaterThan(0);
  });
});
