import { Suspense } from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import ErrorBoundary from "../components/ErrorBoundary";
import { LazyLoading } from "../components/LazyLoading";
import HeroImage from "../shared/components/HeroImage";
import NavigationPanel from "../shared/components/NavigationPanel";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div
      className="grid grid-cols-1 grid-rows-1 overflow-x-auto"
      style={{
        background: isHome ? "black" : "rgba(0,0,0,0)",
      }}
    >
      {isHome && (
        <>
          <div className="row-start-1 row-end-2 col-start-1 col-end-2">
            <HeroImage />
          </div>
          <div className="row-start-1 row-end-2 col-start-1 col-end-2 relative">
            <div
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 30%, black 100%)",
                width: "100%",
                height: "70%",
                position: "absolute",
              }}
            ></div>
          </div>
        </>
      )}

      <div className="row-start-1 row-end-2 col-start-1 col-end-2 flex justify-center">
        <div className="flex-1 flex flex-col max-w-[1920px]">
          <NavigationPanel />

          <main id="yawudb_main" className="flex flex-1">
            <ErrorBoundary>
              <Suspense fallback={<LazyLoading />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}
