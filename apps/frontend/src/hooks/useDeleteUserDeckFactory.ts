import { offlineDB } from "../services/db";
import useAuthUser from "./useAuthUser";
import { useDeleteUserDeck } from "./wunderworldsAPIHooks";

export function useDeleteUserDeckFactory() {
  const user = useAuthUser();
  const [, deleteUserDeck] = useDeleteUserDeck();

  if (user !== null) {
    return function deleteDeckRemotely(deckId: string) {
      return deleteUserDeck({
        url: `/api/v1/user-decks/${deckId}`,
      });
    };
  } else {
    return function deleteDeckLocally(deckId: string) {
      return offlineDB.anonDecks.where("deckId").equals(deckId).delete();
    };
  }
}
