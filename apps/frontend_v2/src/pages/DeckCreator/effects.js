import { FINISH_SAVING_DECK } from "./reducer";
import { logger } from "@/utils/logger";

export const apiSaveDeckAsync = (save) => async (state, effect, dispatch) => {
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
    logger.error("Failed to save deck", e, { deckId: effect.deckMeta?.deckId, deckName: effect.deckMeta?.deckName });
    // TODO: Add user-facing toast notification: "Failed to save deck. Please try again."
  }
};

export const apiUpdateDeckAsync = (update) => async (state, effect, dispatch) => {
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
    logger.error("Failed to update deck", e, { deckId: effect.deckMeta?.deckId, deckName: effect.deckMeta?.deckName });
    // TODO: Add user-facing toast notification: "Failed to update deck. Please try again."
  }
};

export function addKeyToLocalStorage(state, { key, value }) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKeyFromLocalStorage(state, { key }) {
  localStorage.removeItem(key);
}

export function initialiseStateFromLocalStorage(state, { key }, dispatch) {
  const value = localStorage.getItem(key);

  if (!value) return;

  const serializedState = JSON.parse(value);

  dispatch({
    type: "SET_DESERIALIZED_STATE",
    payload: serializedState,
  });
}
