import { createFileRoute } from "@tanstack/react-router";
import MyDecks from "../pages/MyDecks";
import { authReady, getAuthState } from "../hooks/useAuthUser";
import { userDecksQueryOptions } from "../pages/MyDecks/useUserDecksQuery";

export const Route = createFileRoute("/mydecks")({
  loader: async ({ context }) => {
    // Need to know whether we're fetching the user's decks from the API or
    // IndexedDB before firing, so wait for Firebase's first emit. On repeat
    // visits this is already resolved, so it's effectively free.
    await authReady;
    const user = getAuthState().user;
    return context.queryClient.ensureQueryData(userDecksQueryOptions(user));
  },
  component: MyDecks,
});
