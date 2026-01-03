import * as clipboard from 'clipboard-polyfill';
import { Factions } from '@fxdxpz/schema';
import type { DeckCard } from '../types';

export function exportToUDB(cards: DeckCard[]) {
  const deckFormat = new globalThis.Set(cards.map((card) => card.setId)).size > 1 ? 'nemesis' : 'rivals';
  const udbEncodedCards = cards
    .map((card) => `${card.id}`)
    .sort()
    .join();
  window.open(
    `https://www.underworldsdb.com/shared.php?deck=0,${udbEncodedCards}&format=${deckFormat}`
  );
}

export function createShareableLink(cards: DeckCard[], showToast: (msg: string) => void) {
  const link = `${import.meta.env.VITE_BASE_URL}/deck/transfer/wuc,${cards.map((card) => card.id).join(',')}`;
  clipboard.writeText(link);
  showToast('Link copied to clipboard!');
}

export function saveVassalFormat(faction: Factions, cards: DeckCard[], showToast: (msg: string) => void) {
  const cardList = `${faction}\r\n${cards.map((card) => card.id).join(',')}`;
  clipboard.writeText(cardList);
  showToast('Deck copied to clipboard!');
}
