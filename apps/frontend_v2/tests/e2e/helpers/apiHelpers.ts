/**
 * API Helper Functions for Test Cleanup
 * These functions interact with the backend API to manage decks for testing
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8181';

/**
 * Delete a specific deck via API
 * @param deckId - The deck ID to delete
 * @param authToken - Firebase auth token
 */
export async function deleteDeckViaAPI(
  deckId: string,
  authToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v2/decks/${deckId}`, {
    method: 'DELETE',
    headers: {
      'authtoken': authToken
    }
  });

  if (!response.ok) {
    console.warn(`Failed to delete deck ${deckId}: ${response.status}`);
  }
}

/**
 * Get all user decks via API
 * @param authToken - Firebase auth token
 * @param fuid - Firebase user ID
 * @returns Array of deck objects
 */
async function getUserDecksViaAPI(
  authToken: string,
  fuid: string
): Promise<any[]> {
  const response = await fetch(
    `${API_BASE_URL}/v2/decks?fuid=${fuid}&limit=100`,
    {
      headers: {
        'authtoken': authToken
      }
    }
  );

  if (!response.ok) {
    console.warn(`Failed to fetch user decks: ${response.status}`);
    return [];
  }

  const data = await response.json();
  return data.decks || [];
}

/**
 * Delete all user decks via API (for test cleanup)
 * @param authToken - Firebase auth token
 * @param fuid - Firebase user ID
 */
export async function deleteAllUserDecksViaAPI(
  authToken: string,
  fuid: string
): Promise<void> {
  try {
    const decks = await getUserDecksViaAPI(authToken, fuid);

    // Delete all decks in parallel
    await Promise.all(
      decks.map(deck => deleteDeckViaAPI(deck.deckId, authToken))
    );
  } catch (error) {
    console.error('Error deleting all decks:', error);
  }
}
