import { createFileRoute } from "@tanstack/react-router";
import MyDecks from "../pages/MyDecks";
import { authReady, getAuthState } from "../hooks/useAuthUser";
import { userDecksQueryOptions } from "../pages/MyDecks/useUserDecksQuery";

export const Route = createFileRoute("/mydecks")({
  loader: async ({ context }) => {
    // Wait for Firebase's first emit so the query fires with the right user
    // (prevents an anon→signed-in flicker). On repeat visits this is already
    // resolved, so it's effectively free. The data prefetch itself does NOT
    // block navigation — useSuspenseQuery in the component suspends into the
    // root Suspense boundary if the cache is still cold.
    await authReady;
    const user = getAuthState().user;
    void context.queryClient.prefetchQuery(userDecksQueryOptions(user));
  },
  component: MyDecks,
});
