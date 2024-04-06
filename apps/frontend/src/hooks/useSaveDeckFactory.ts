import { offlineDB } from "../services/db";
import useAuthUser from "./useAuthUser";
import { usePostUserDeck } from "./wunderworldsAPIHooks";

export function useSaveDeckFactory() {
  const user = useAuthUser();
  const [, saveUserDeck] = usePostUserDeck();

  if (user !== null) {
    return saveUserDeck;
  } else {
    // TODO: FIX ME!!!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function saveLocally(payload: any) {
      const now = new Date().getTime();
      return offlineDB.anonDecks.add({
        ...payload.data,
        createdutc: now,
        updatedutc: now,
      });
    };
  }
}
