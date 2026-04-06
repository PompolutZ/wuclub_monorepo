import {
  getFactionByName,
  getAllSetsValidForFormat,
  NEMESIS_FORMAT,
  wufactions,
} from "@fxdxpz/wudb";
import type { Card, Set as WuSet } from "@fxdxpz/wudb";

export const DECK_IN_PROGRESS_KEY = "wunderworlds_deck_in_progress";

export const UPDATE_FILTERS_ACTION = "UPDATE_FILTERS";
export const TOGGLE_CARD_ACTION = "TOGGLE_CARD";
export const RESET_DECK_ACTION = "RESET_DECK_ACTION";
export const SAVE_DECK = "SAVE_DECK";
export const UPDATE_DECK = "UPDATE_DECK";
export const FINISH_SAVING_DECK = "FINISH_SAVING_DECK";
export const SAVE_ERROR = "SAVE_ERROR";
export const SET_DESERIALIZED_STATE = "SET_DESERIALIZED_STATE";

export const STATUS_IDLE = "Idle";
export const STATUS_SAVING = "Saving";
export const STATUS_SAVED = "Saved";
export const STATUS_ERROR = "Error";

export type Faction = (typeof wufactions)[keyof typeof wufactions];

export type EnrichedCard = Card & { isBanned: boolean; isRestricted: boolean };

export type CardFilter = { test?: (card: Card) => boolean };

export type DeckMeta = {
  deckName: string;
  deckId: string;
  author?: string;
  authorDisplayName?: string;
  private?: boolean;
};

export type DeckBuilderState = {
  faction: Faction;
  sets: WuSet[];
  format: string;
  selectedObjectives: Card[];
  selectedGambits: Card[];
  selectedUpgrades: Card[];
  visibleCardTypes: string[];
  status: string;
  saveError: string | null;
};

type ExecEffect =
  | { type: "addKeyToLocalStorage"; key: string; value: DeckBuilderState }
  | { type: "removeKeyFromLocalStorage"; key: string }
  | { type: "saveDeck"; deckMeta: DeckMeta }
  | { type: "updateDeck"; deckMeta: DeckMeta }
  | { type: "initialiseStateFromLocalStorage"; key: string };

export type DeckBuilderAction =
  | { type: typeof UPDATE_FILTERS_ACTION; payload: Partial<DeckBuilderState> }
  | { type: typeof TOGGLE_CARD_ACTION; payload: Card }
  | { type: typeof RESET_DECK_ACTION }
  | { type: typeof SAVE_DECK; payload: DeckMeta }
  | { type: typeof UPDATE_DECK; payload: DeckMeta }
  | { type: typeof FINISH_SAVING_DECK }
  | { type: typeof SAVE_ERROR; payload: string }
  | { type: typeof SET_DESERIALIZED_STATE; payload: DeckBuilderState };

type ExecFn = (effect: ExecEffect) => void;

export function toggleCardAction(card: Card): DeckBuilderAction {
  return { type: TOGGLE_CARD_ACTION, payload: card };
}

export function resetDeckAction(): DeckBuilderAction {
  return { type: RESET_DECK_ACTION };
}

export function saveDeckAction(deckMeta: DeckMeta): DeckBuilderAction {
  return { type: SAVE_DECK, payload: deckMeta };
}

export function updateDeckAction(deckMeta: DeckMeta): DeckBuilderAction {
  return { type: UPDATE_DECK, payload: deckMeta };
}

export const INITIAL_STATE: DeckBuilderState = {
  faction: getFactionByName("universal") as Faction,
  sets: getAllSetsValidForFormat(NEMESIS_FORMAT).slice(0, 2),
  format: NEMESIS_FORMAT,
  selectedObjectives: [],
  selectedGambits: [],
  selectedUpgrades: [],
  visibleCardTypes: [],
  status: STATUS_IDLE,
  saveError: null,
};

export const deckBuilderReducer = (
  state: DeckBuilderState,
  event: DeckBuilderAction,
  exec: ExecFn,
): DeckBuilderState => {
  switch (event.type) {
    case UPDATE_FILTERS_ACTION: {
      const nextState = {
        ...state,
        ...event.payload,
      };

      exec({
        type: "addKeyToLocalStorage",
        key: DECK_IN_PROGRESS_KEY,
        value: nextState,
      });

      return nextState;
    }
    case TOGGLE_CARD_ACTION: {
      const deck = [
        ...state.selectedObjectives,
        ...state.selectedGambits,
        ...state.selectedUpgrades,
      ];

      const cardWillBeRemoved = deck.find(({ id }) => id === event.payload.id);
      const nextState = { ...state };

      if (event.payload.type === "Objective") {
        nextState.selectedObjectives = cardWillBeRemoved
          ? state.selectedObjectives.filter(({ id }) => id !== event.payload.id)
          : [...state.selectedObjectives, event.payload];
      } else if (event.payload.type === "Upgrade") {
        nextState.selectedUpgrades = cardWillBeRemoved
          ? state.selectedUpgrades.filter(({ id }) => id !== event.payload.id)
          : [...state.selectedUpgrades, event.payload];
      } else {
        nextState.selectedGambits = cardWillBeRemoved
          ? state.selectedGambits.filter(({ id }) => id !== event.payload.id)
          : [...state.selectedGambits, event.payload];
      }

      exec({
        type: "addKeyToLocalStorage",
        key: DECK_IN_PROGRESS_KEY,
        value: nextState,
      });

      return nextState;
    }

    case RESET_DECK_ACTION: {
      const nextState = {
        ...state,
        selectedObjectives: [],
        selectedGambits: [],
        selectedUpgrades: [],
      };

      exec({
        type: "addKeyToLocalStorage",
        key: DECK_IN_PROGRESS_KEY,
        value: nextState,
      });

      return nextState;
    }

    case SAVE_DECK:
      exec({ type: "saveDeck", deckMeta: event.payload });
      return { ...state, status: STATUS_SAVING, saveError: null };

    case UPDATE_DECK:
      exec({ type: "updateDeck", deckMeta: event.payload });
      return { ...state, status: STATUS_SAVING, saveError: null };

    case FINISH_SAVING_DECK:
      exec({
        type: "removeKeyFromLocalStorage",
        key: DECK_IN_PROGRESS_KEY,
      });
      return { ...state, status: STATUS_SAVED };

    case SAVE_ERROR:
      return { ...state, status: STATUS_IDLE, saveError: event.payload };

    case SET_DESERIALIZED_STATE:
      return event.payload;

    default:
      return state;
  }
};
