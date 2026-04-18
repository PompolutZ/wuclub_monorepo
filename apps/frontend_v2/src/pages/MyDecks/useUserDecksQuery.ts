import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import Firebase from "../../firebase";
import { api } from "../../services/api";
import { offlineDB } from "../../services/db";
import useAuthUser, { type AuthUser } from "../../hooks/useAuthUser";
import { Deck } from "@fxdxpz/schema";
import { USER_DECKS_KEY } from "../../services/queryKeys";

type UserDecksResult = { decks: Deck[]; total: number };

// auth is passed in rather than read from context because loaders run
// outside React. For component use, pass the result of useAuthUser().
export const userDecksQueryOptions = (user: AuthUser | null) =>
  queryOptions<UserDecksResult>({
    queryKey: [USER_DECKS_KEY, { user: user?.fuid ?? "anon" }],
    queryFn: async () => {
      if (!user) {
        const offlineDecks = await offlineDB.anonDecks.toArray();
        return {
          decks: offlineDecks.toSorted(
            (x, y) => y.updatedutc - x.updatedutc,
          ) as unknown as Deck[],
          total: offlineDecks.length,
        };
      }

      const token = await Firebase.getTokenId();
      const res = await api.v2.users.decks.$get(
        { query: { edition: "2" } },
        { headers: { authtoken: token } },
      );
      return (await res.json()) as unknown as UserDecksResult;
    },
  });

export const useUserDecksQuery = () => {
  const user = useAuthUser() as AuthUser | null;
  return useSuspenseQuery(userDecksQueryOptions(user));
};
