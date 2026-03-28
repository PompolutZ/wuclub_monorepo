import { Factions } from '@fxdxpz/schema';
import { SetId, Card } from '@wudb';

// DeckCard is essentially a Card from the database
export type DeckCard = Card;

export interface ReadonlyDeckProps {
  id: string;
  name: string;
  factionId: string;
  faction: Factions;
  cards: DeckCard[];
  sets: SetId[];
  created?: string;
  createdutc?: number;
  updatedutc?: number;
  private: boolean;
  canUpdateOrDelete: boolean;
}

export interface DeckSummaryProps {
  faction: Factions;
  name: string;
  date: string;
  sets: SetId[];
  isPrivate: boolean;
  children?: React.ReactNode;
}


export interface ProcessedDeck {
  id: string;
  name: string;
  factionId: string;
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
