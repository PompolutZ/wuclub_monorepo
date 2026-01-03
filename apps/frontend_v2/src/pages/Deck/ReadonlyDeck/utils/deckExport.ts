import * as clipboard from 'clipboard-polyfill';
import { Factions } from '@fxdxpz/schema';
import type { DeckCard } from '../types';
import { UNDERWORLDS_DB_URL, DECK_TRANSFER_PREFIX, VASSAL_LINE_SEPARATOR } from '../constants';

/**
 * Opens UnderworldsDB with the current deck loaded
 * Automatically detects deck format (rivals or nemesis) based on card sets
 * @param cards - Array of deck cards
 */
export function exportToUDB(cards: DeckCard[]) {
  const deckFormat = new globalThis.Set(cards.map((card) => card.setId)).size > 1 ? 'nemesis' : 'rivals';
  const udbEncodedCards = cards
    .map((card) => `${card.id}`)
    .sort()
    .join();
  window.open(
    `${UNDERWORLDS_DB_URL}/shared.php?deck=0,${udbEncodedCards}&format=${deckFormat}`
  );
}

/**
 * Creates a shareable link for the deck and copies it to clipboard
 * @param cards - Array of deck cards
 * @param showToast - Toast notification function
 */
export function createShareableLink(cards: DeckCard[], showToast: (msg: string) => void) {
  const link = `${import.meta.env.VITE_BASE_URL}/deck/transfer/${DECK_TRANSFER_PREFIX},${cards.map((card) => card.id).join(',')}`;
  clipboard.writeText(link);
  showToast('Link copied to clipboard!');
}

/**
 * Copies deck in Vassal format to clipboard
 * Format: faction name followed by comma-separated card IDs
 * @param faction - Deck faction
 * @param cards - Array of deck cards
 * @param showToast - Toast notification function
 */
export function saveVassalFormat(faction: Factions, cards: DeckCard[], showToast: (msg: string) => void) {
  const cardList = `${faction}${VASSAL_LINE_SEPARATOR}${cards.map((card) => card.id).join(',')}`;
  clipboard.writeText(cardList);
  showToast('Deck copied to clipboard!');
}
