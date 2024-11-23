import React, { useContext } from "react";
import { useEffectReducer } from "use-effect-reducer";
import { deckBuilderReducer, INITIAL_STATE } from "./reducer";
import {
  addKeyToLocalStorage,
  removeKeyFromLocalStorage,
  initialiseStateFromLocalStorage,
  apiSaveDeckAsync,
  apiUpdateDeckAsync,
} from "./effects";
import DeckBuilder from "./DeckBuilder";
import { useStateCreator } from "./useStateCreator";
import { useSaveDeck } from "@/shared/hooks/useSaveDeck";
import { useUpdateDeck } from "@/shared/hooks/useUpdateDeck";

const DeckBuilderContext = React.createContext();
const DeckBuilderDispatchContext = React.createContext();

export function useDeckBuilderState() {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw Error(
      "useDeckBuilderState should be used within DeckBuilderContextProvider",
    );
  }

  return context;
}

export function useDeckBuilderDispatcher() {
  const context = useContext(DeckBuilderDispatchContext);
  if (context === undefined) {
    throw Error(
      "useDeckBuilderDispatcher should be used within DeckBuilderDispatchContextProvider",
    );
  }

  return context;
}

const initialiseState = (deck) => (exec) => {
  if (deck) {
    return deck;
  }

  exec({
    type: "initialiseStateFromLocalStorage",
    key: "wunderworlds_deck_in_progress",
  });

  return INITIAL_STATE;
};

function DeckBuilderContextProvider({ children, deck }) {
  const { mutateAsync: saveDeck } = useSaveDeck();
  const { mutateAsync: updateDeck } = useUpdateDeck();
  const [state, dispatch] = useEffectReducer(
    deckBuilderReducer,
    initialiseState(deck),
    {
      saveDeck: apiSaveDeckAsync(saveDeck),
      updateDeck: apiUpdateDeckAsync(updateDeck),
      addKeyToLocalStorage,
      removeKeyFromLocalStorage,
      initialiseStateFromLocalStorage,
    },
  );

  return (
    <DeckBuilderContext.Provider value={state}>
      <DeckBuilderDispatchContext.Provider value={dispatch}>
        {children}
      </DeckBuilderDispatchContext.Provider>
    </DeckBuilderContext.Provider>
  );
}

function DeckCreator() {
  const { state, previous } = useStateCreator();

  return (
    <DeckBuilderContextProvider deck={state}>
      <DeckBuilder
        existingDeckId={previous?.id}
        currentDeckName={previous?.name}
        isPrivate={previous?.private}
      />
    </DeckBuilderContextProvider>
  );
}

export default DeckCreator;
