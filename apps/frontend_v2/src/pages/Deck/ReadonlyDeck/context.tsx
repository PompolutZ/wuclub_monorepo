import { createContext, useContext } from "react";
import type { ProcessedDeck } from "./types";

interface DeckContextValue {
  deckId: string;
  deck: ProcessedDeck;
  canUpdateOrDelete: boolean;
  isPrivate: boolean;
  cardsView: boolean;
  toggleDeckPrivacy: () => void;
  onDelete: () => void;
  onCardsViewChange: () => void;
  exportToUDB: () => void;
  createShareableLink: () => void;
  copyInVassalFormat: () => void;
  onDownloadProxy: () => void;
  onSpawnRoom: () => void;
  hasActiveRoom: boolean;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export const DeckProvider = DeckContext.Provider;

export function useDeckContext(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeckContext must be used inside DeckProvider");
  return ctx;
}
