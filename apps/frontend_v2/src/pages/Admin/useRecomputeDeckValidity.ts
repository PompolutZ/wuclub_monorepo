import { useMutation, useQueryClient } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { DECK_VALIDITY_STATS_KEY } from "./useDeckValidityStats";

export const useRecomputeDeckValidity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = await Firebase.getTokenId();
      const res = await api.v2.admin.jobs["recompute-deck-validity"].$post(
        undefined,
        { headers: { authtoken: token } },
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DECK_VALIDITY_STATS_KEY });
    },
  });
};
