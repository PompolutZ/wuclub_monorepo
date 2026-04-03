import { useEffect } from "react";
import useAuthUser from "../../hooks/useAuthUser";
import { offlineDB } from "../../services/db";
import { useSaveDeck } from "../../shared/hooks/useSaveDeck";
import { logger } from "@/utils/logger";

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
            await saveDeck(d as never);
            return (d as unknown as { id: number }).id;
          }),
        );
      })
      .then((idsToDelete) => {
        offlineDB.anonDecks.bulkDelete(idsToDelete);
      })
      .catch((e) => {
        logger.error("Failed to sync anonymous decks", e as Error, {
          userId: user?.uid,
        });
      });
  }, [user, saveDeck]);
}
