import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="flex-1 grid grid-cols-1 grid-rows-[auto_1fr]">
      <nav className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
