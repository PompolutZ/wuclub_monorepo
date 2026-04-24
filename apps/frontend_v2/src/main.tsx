import React from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import Firebase, { FirebaseContext } from "./firebase";
import {
  AuthContextProvider,
  INITIAL_AUTH_STATE,
  useAuthState,
} from "./hooks/useAuthUser";
import { queryClient, persister } from "@services/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { routeTree } from "./routeTree.gen";
import { LazyLoading } from "./components/LazyLoading";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 50,
  // Show pending component immediately so cold-Lambda navigations swap the
  // old page for a loading shell instead of freezing on stale content.
  defaultPendingMs: 0,
  // Once shown, hold at least this long to avoid sub-frame flashes on fast loads.
  defaultPendingMinMs: 300,
  defaultPendingComponent: LazyLoading,
  context: { auth: INITIAL_AUTH_STATE, queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const modalRoot = document.getElementById("modal-root");
export class ModalPresenter extends React.Component<
  React.PropsWithChildren<object>
> {
  private el: HTMLDivElement;

  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot?.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot?.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}

// Pass fresh auth into router context on every change so React consumers
// (NavigationPanel, etc.) see updates. Gated routes don't read context.auth
// from beforeLoad — they await the module-level `authReady` promise and then
// call `getAuthState()` so public routes don't pay any auth-wait tax.
function InnerApp() {
  const auth = useAuthState();
  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

const Root = () => (
  <FirebaseContext.Provider value={Firebase}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <AuthContextProvider>
        <InnerApp />
      </AuthContextProvider>
    </PersistQueryClientProvider>
  </FirebaseContext.Provider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
