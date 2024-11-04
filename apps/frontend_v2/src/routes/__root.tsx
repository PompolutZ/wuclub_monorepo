import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { Navigation } from "../components/Navigation";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export const Route = createRootRoute({
  component: () => (
    <div className="flex-1 grid grid-cols-1 grid-rows-1">
      {/* Main layout container */}
      <div className="row-span-full col-span-full grid grid-rows-[auto_1fr] grid-cols-1">
        {/* Navigation bar - consistent across all pages */}
        <Navigation />

        {/* Outlet for page content */}
        <Outlet />

        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </div>
    </div>
  ),
});
