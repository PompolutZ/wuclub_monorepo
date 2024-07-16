import { useEffect } from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { offlineDB } from "../../services/db";
import { useSaveDeck } from "../../shared/hooks/useSaveDeck";

// TODO: https://github.com/PompolutZ/wuclub_monorepo/issues/3
export function useAnonDecksSynchronisation() {
  const user = useAuthUser();
  const { mutateAsync: saveDeck } = useSaveDeck();

  useEffect(() => {
    if (!user) return;
    offlineDB.anonDecks
      .toArray()
      .then((anonDecks) => {
        return Promise.all(
          anonDecks.map(async (d) => {
            await saveDeck(d);
            return (d as unknown as { id: number }).id;
          }),
        );
      })
      .then((idsToDelete) => {
        offlineDB.anonDecks.bulkDelete(idsToDelete);
      })
      .catch((e) => {
        console.error("Error", e);
      });
  }, [user, saveDeck]);
}
