import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import { DeckPayload } from "@fxdxpz/schema";

export const useUpdateDeck = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  return useMutation({
    mutationFn: async ({
      deckId,
      deck,
    }: {
      deckId: string;
      deck: Partial<Omit<DeckPayload, "deckId">>;
    }) => {
      if (!user) {
        const now = new Date().getTime();
        // TODO: This is not nice.
        // https://github.com/PompolutZ/wuclub_monorepo/issues/4
        return offlineDB.anonDecks
          .where("deckId")
          .equals(deckId)
          .modify({
            ...deck,
            updatedutc: now,
          });
      }

      const token = await Firebase.getTokenId();
      return api.v2.decks[":id"].$put(
        { param: { id: deckId }, json: deck },
        {
          headers: {
            authtoken: `${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userDecks", { user: user?.fuid ?? "anon" }],
      });
    },
  });
};
