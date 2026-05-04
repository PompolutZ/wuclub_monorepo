import { useQuery } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";

export const DECK_VALIDITY_STATS_KEY = ["admin", "deck-validity-stats"];

export const useDeckValidityStats = () =>
  useQuery({
    queryKey: DECK_VALIDITY_STATS_KEY,
    queryFn: async () => {
      const token = await Firebase.getTokenId();
      const res = await api.v2.admin.stats["deck-validity"].$get(undefined, {
        headers: { authtoken: token },
      });
      return res.json();
    },
  });
