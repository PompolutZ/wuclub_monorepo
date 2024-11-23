import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import { offlineDB } from "@services/db";
import { api } from "@services/api";
import Firebase from "../../firebase";

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  return useMutation({
    mutationFn: async (deckId: string) => {
      if (!user) {
        return offlineDB.anonDecks.where("deckId").equals(deckId).delete();
      }

      const token = await Firebase.getTokenId();
      return api.v2.decks[":id"].$delete(
        { param: { id: deckId } },
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
