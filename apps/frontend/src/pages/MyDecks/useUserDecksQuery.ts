import { useQuery } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import useAuthUser from "../../hooks/useAuthUser";

export const useUserDecksQuery = () => {
  const user = useAuthUser();
  return useQuery({
    queryKey: ["userDecks", { user: user?.fuid ?? "anon" }],
    queryFn: async () => {
      if (!user) {
        const offlineDecks = await offlineDB.anonDecks.toArray();
        return offlineDecks.toSorted((x, y) => y.updatedutc - x.updatedutc);
      }

      const token = await Firebase.getTokenId();
      if (token) {
        const res = await api.v2.users.decks.$get(undefined, {
          headers: {
            authtoken: token,
          },
        });
        return res.json();
      }
    },
  });
};
