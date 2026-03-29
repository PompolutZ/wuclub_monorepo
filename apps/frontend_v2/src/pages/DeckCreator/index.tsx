import React, { useContext } from "react";
import { useEffectReducer } from "use-effect-reducer";
import { deckBuilderReducer, INITIAL_STATE, DECK_IN_PROGRESS_KEY } from "./reducer";
import type { DeckBuilderAction, DeckBuilderState } from "./reducer";
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

type Dispatch = (action: DeckBuilderAction) => void;

const DeckBuilderContext = React.createContext<DeckBuilderState | undefined>(undefined);
const DeckBuilderDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export function useDeckBuilderState(): DeckBuilderState {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw Error(
      "useDeckBuilderState should be used within DeckBuilderContextProvider",
    );
  }

  return context;
}

export function useDeckBuilderDispatcher(): Dispatch {
  const context = useContext(DeckBuilderDispatchContext);
  if (context === undefined) {
    throw Error(
      "useDeckBuilderDispatcher should be used within DeckBuilderDispatchContextProvider",
    );
  }

  return context;
}

const initialiseState = (deck: DeckBuilderState | null) => (exec: (effect: { type: string; key: string }) => void) => {
  if (deck) {
    return deck;
  }

  exec({
    type: "initialiseStateFromLocalStorage",
    key: DECK_IN_PROGRESS_KEY,
  });

  return INITIAL_STATE;
};

function DeckBuilderContextProvider({ children, deck }: { children: React.ReactNode; deck: DeckBuilderState | null }) {
  const { mutateAsync: saveDeck } = useSaveDeck();
  const { mutateAsync: updateDeck } = useUpdateDeck();
  const [state, dispatch] = useEffectReducer(
    deckBuilderReducer,
    initialiseState(deck) as never,
    {
      saveDeck: apiSaveDeckAsync(saveDeck as never) as never,
      updateDeck: apiUpdateDeckAsync(updateDeck as never) as never,
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
