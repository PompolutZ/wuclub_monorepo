import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

export const useDeckStats = () => {
  return useQuery({
    queryKey: ["deckStats"],
    queryFn: async () => {
      const res = await api.v2.stats.decks.$get();
      return res.json();
    },
  });
};
