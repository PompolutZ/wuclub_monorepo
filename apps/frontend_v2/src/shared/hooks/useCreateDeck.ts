import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import { DeckPayload } from "@fxdxpz/schema";
import { PUBLIC_DECKS_KEY, USER_DECKS_KEY } from "../../services/queryKeys";

export const useCreateDeck = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  return useMutation({
    mutationFn: async (deck: DeckPayload) => {
      if (!user) {
        const now = new Date().getTime();
        // TODO: This is not nice.
        // https://github.com/PompolutZ/wuclub_monorepo/issues/4
        return offlineDB.anonDecks.add({
          ...(deck as unknown as import("../../services/db").AnonDecks),
          createdutc: now,
          updatedutc: now,
        });
      }

      const token = await Firebase.getTokenId();
      return api.v2.decks.$post(
        {
          json: {
            ...deck,
            edition: 2, // This is a hack to skip rebuilding all api endpoints for now
          },
        },
        {
          headers: {
            authtoken: `${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DECKS_KEY, { user: user?.fuid ?? "anon" }],
      });
      queryClient.invalidateQueries({ queryKey: [PUBLIC_DECKS_KEY] });
    },
  });
};
