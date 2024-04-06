import { offlineDB } from "../services/db";
import useAuthUser from "./useAuthUser";
import { useUpdateUserDeck } from "./wunderworldsAPIHooks";

export function useUpdateDeckFactory() {
  const user = useAuthUser();
  const [, update] = useUpdateUserDeck();

  if (user !== null) {
    return update;
  } else {
    // TODO: FIX ME!!!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function saveLocally(payload: any) {
      const now = new Date().getTime();
      const [deckId] = payload.url.split("/").slice(-1);

      return offlineDB.anonDecks
        .where("deckId")
        .equals(deckId)
        .modify({
          ...payload.data,
          updatedutc: now,
        });
    };
  }
}
