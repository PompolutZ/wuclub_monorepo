import { FINISH_SAVING_DECK, SAVE_ERROR } from "./reducer";
import type { DeckBuilderAction, DeckBuilderState, DeckMeta } from "./reducer";
import { logger } from "@/utils/logger";

type Dispatch = (action: DeckBuilderAction) => void;
type EffectWithMeta = { deckMeta: DeckMeta & { private?: boolean } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveFn = (args: any) => Promise<any>;

export const apiSaveDeckAsync =
  (save: SaveFn) =>
  async (
    state: DeckBuilderState,
    effect: EffectWithMeta,
    dispatch: Dispatch,
  ) => {
    try {
      const { deckName, deckId } = effect.deckMeta;

      const deck = [
        ...state.selectedObjectives,
        ...state.selectedGambits,
        ...state.selectedUpgrades,
      ];

      await save({
        deckId,
        private: false,
        name: deckName,
        faction: state.faction.name,
        deck: deck.map((c) => c.id),
        sets: Array.from(new Set(deck.map((c) => c.setId))),
      });

      dispatch({ type: FINISH_SAVING_DECK });
    } catch (e) {
      logger.error("Failed to save deck", e instanceof Error ? e : undefined, {
        deckId: effect.deckMeta?.deckId,
        deckName: effect.deckMeta?.deckName,
      });
      dispatch({
        type: SAVE_ERROR,
        payload: "Failed to save deck. Please try again.",
      });
    }
  };

export const apiUpdateDeckAsync =
  (update: SaveFn) =>
  async (
    state: DeckBuilderState,
    effect: EffectWithMeta,
    dispatch: Dispatch,
  ) => {
    try {
      const { deckName, deckId } = effect.deckMeta;

      const deck = [
        ...state.selectedObjectives,
        ...state.selectedGambits,
        ...state.selectedUpgrades,
      ];

      await update({
        deckId,
        deck: {
          private: effect.deckMeta.private,
          name: deckName,
          faction: state.faction.name,
          deck: deck.map((c) => c.id),
          sets: Array.from(new Set(deck.map((c) => c.setId))),
        },
      });

      dispatch({ type: FINISH_SAVING_DECK });
    } catch (e) {
      logger.error(
        "Failed to update deck",
        e instanceof Error ? e : undefined,
        {
          deckId: effect.deckMeta?.deckId,
          deckName: effect.deckMeta?.deckName,
        },
      );
      dispatch({
        type: SAVE_ERROR,
        payload: "Failed to update deck. Please try again.",
      });
    }
  };

export function addKeyToLocalStorage(
  _state: unknown,
  { key, value }: { key: string; value: unknown },
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKeyFromLocalStorage(
  _state: unknown,
  { key }: { key: string },
): void {
  localStorage.removeItem(key);
}

export function initialiseStateFromLocalStorage(
  _state: unknown,
  { key }: { key: string },
  dispatch: Dispatch,
): void {
  const value = localStorage.getItem(key);

  if (!value) return;

  const serializedState = JSON.parse(value);

  dispatch({
    type: "SET_DESERIALIZED_STATE",
    payload: serializedState,
  });
}
