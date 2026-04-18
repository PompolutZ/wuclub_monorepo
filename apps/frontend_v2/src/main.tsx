import React from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import Firebase, { FirebaseContext } from "./firebase";
import { AuthContextProvider } from "./hooks/useAuthUser";
import { queryClient, persister } from "@services/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 50,
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

const Root = () => (
  <FirebaseContext.Provider value={Firebase}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </PersistQueryClientProvider>
  </FirebaseContext.Provider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
