import { Factions } from '@fxdxpz/schema';
import { SetId, Card } from '@wudb';

// DeckCard is essentially a Card from the database
export type DeckCard = Card;

export interface UserInfo {
  displayName: string;
}

export interface ReadonlyDeckProps {
  id: string;
  name: string;
  author: string;
  faction: Factions;
  cards: DeckCard[];
  sets: SetId[];
  created?: string;
  createdutc?: number;
  updatedutc?: number;
  private: boolean;
  userInfo?: UserInfo[];
  canUpdateOrDelete: boolean;
  cardsView: boolean;
  onCardsViewChange: () => void;
  onDelete: () => void;
  showToast: (message: string) => void;
}

export interface DeckSummaryProps {
  faction: Factions;
  name: string;
  author?: string;
  date: string;
  sets: SetId[];
  isPrivate: boolean;
  children?: React.ReactNode;
}

export interface DeckActionsMenuProps {
  deckId: string;
  deck: ProcessedDeck;
  isPrivate: boolean;
  onToggleDeckPrivacy: () => void;
  exportToUDB: () => void;
  createShareableLink: () => void;
  onDelete: () => void;
  canUpdateOrDelete: boolean;
}

export interface DeckActionsMenuLargeProps {
  deckId: string;
  deck: ProcessedDeck;
  isPrivate: boolean;
  onToggleDeckPrivacy: () => void;
  exportToUDB: () => void;
  createShareableLink: () => void;
  onDelete: () => void;
  canUpdateOrDelete: boolean;
  cardsView: boolean;
  onCardsViewChange: () => void;
  copyInVassalFormat: () => void;
  onDownloadProxy: () => void;
}

export interface ProcessedDeck {
  id: string;
  name: string;
  author: string;
  faction: Factions;
  sets: SetId[];
  created?: string;
  createdutc?: number;
  updatedutc?: number;
  objectives: DeckCard[];
  gambits: DeckCard[];
  upgrades: DeckCard[];
  private: boolean;
}

export interface CardProps {
  card: DeckCard;
  asImage?: boolean;
}

export interface CardsSectionContentProps {
  cards: DeckCard[];
  listView: boolean;
}

export interface ToastProps {
  show: boolean;
  className?: string;
  children?: React.ReactNode;
  onTimeout: () => void;
}
