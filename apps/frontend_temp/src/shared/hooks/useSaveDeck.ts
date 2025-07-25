import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import { DeckPayload } from "@fxdxpz/schema";

export const useSaveDeck = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  return useMutation({
    mutationFn: async (deck: DeckPayload) => {
      if (!user) {
        const now = new Date().getTime();
        // TODO: This is not nice.
        // https://github.com/PompolutZ/wuclub_monorepo/issues/4
        return offlineDB.anonDecks.add({
          ...deck,
          createdutc: now,
          updatedutc: now,
        });
      }

      const token = await Firebase.getTokenId();
      return api.v2.decks.$post(
        { json: {
          ...deck,
          edition: 2, // This is a hack to skip rebuilding all api endpoints for now
        } },
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
