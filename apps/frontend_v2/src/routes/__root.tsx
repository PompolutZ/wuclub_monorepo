import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

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
      {window.location.pathname === "/" && (
        <div className="bg-black row-span-full col-span-full">
          <picture>
            <source
              srcSet="/assets/hero/Background_Texture_Green.avif"
              type="image/avif"
            />
            <source
              srcSet="/assets/hero/Background_Texture_Green.webp"
              type="image/webp"
            />
            <img
              loading="lazy"
              src="/assets/hero/Background_Texture_Green.jpg"
              alt="Hero Image"
              className="w-full"
            />
          </picture>
        </div>
      )}
      <div className="row-span-full col-span-full grid grid-rows-[auto_1fr] grid-cols-1">
        <nav className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/decks" className="[&.active]:font-bold">
            Public decks
          </Link>{" "}
          <Link to="/library" className="[&.active]:font-bold">
            Library
          </Link>{" "}
        </nav>
        <Outlet />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </div>
    </div>
  ),
});
