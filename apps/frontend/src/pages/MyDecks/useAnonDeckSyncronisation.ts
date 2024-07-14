import axios from "axios";
import { useEffect } from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { useSaveDeckFactory } from "../../hooks/useSaveDeckFactory";
import { offlineDB } from "../../services/db";

// TODO: https://github.com/PompolutZ/wuclub_monorepo/issues/3
export function useAnonDecksSynchronisation(refetch: () => void) {
  const user = useAuthUser();
  const saveDeck = useSaveDeckFactory();

  useEffect(() => {
    if (!user) return;
    offlineDB.anonDecks
      .toArray()
      .then((anonDecks) => {
        return Promise.all(
          anonDecks.map(async (d) => {
            const {
              deckId,
              createdutc,
              updatedutc,
              deck,
              sets,
              name,
              faction,
            } = d;
            await axios.post("/api/v1/user-decks", {
              deckId,
              createdutc,
              updatedutc,
              deck,
              sets,
              name,
              faction,
              private: d.private,
            });

            return d.id;
          }),
        );
      })

      .then((idsToDelete) => {
        offlineDB.anonDecks.bulkDelete(idsToDelete);
      })
      .then(() => {
        refetch();
      })
      .catch((e) => {
        console.error("Error", e);
      });
  }, [user, refetch, saveDeck]);
}
