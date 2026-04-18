import { createFileRoute, redirect } from "@tanstack/react-router";
import { authReady, getAuthState } from "../hooks/useAuthUser";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    // Wait for Firebase's first emit — only this branch pays the cost,
    // public routes render without blocking on auth.
    await authReady;
    const auth = getAuthState();

    if (!auth.user) {
      throw redirect({
        to: "/login",
        // After login we currently always land on /mydecks — revisit if we
        // want to honor a return-to path.
        search: { redirect: location.href } as never,
      });
    }
    if (!auth.isAdmin) {
      throw redirect({ to: "/" });
    }
  },
});
