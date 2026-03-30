import React, { Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from "react-router-dom";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { LazyLoading } from "./components/LazyLoading";
import * as ROUTES from "./constants/routes";
import Firebase, { FirebaseContext } from "./firebase";
import { AuthContextProvider } from "./hooks/useAuthUser";
import HeroImage from "./shared/components/HeroImage";
import NavigationPanel from "./shared/components/NavigationPanel";
import { queryClient, persister } from "@services/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const Home = lazy(() => import("./pages/Home"));
const DeckCreator = lazy(() => import("./pages/DeckCreator"));
const Decks = lazy(() => import("./pages/Decks"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Library = lazy(() => import("./pages/Library/Library"));
const Deck = lazy(() => import("./pages/Deck"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Card = lazy(() => import("./pages/Card"));
const MyDecks = lazy(() => import("./pages/MyDecks/index"));
const Login = lazy(() => import("./pages/Login"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PasswordResetRequest = lazy(() => import("./pages/PasswordResetRequest"));
const BoardsPage = lazy(() => import("./pages/Boards"));

function MainLayout() {
  const { pathname } = useLocation();
  return (
    <>
      {/* LEARN HOW TO MAKE THIS WITH TAILWIND */}
      <div
        className="grid grid-cols-1 grid-rows-1 overflow-x-auto"
        style={{
          background: pathname == "/" ? "black" : "rgba(0,0,0,0)",
        }}
      >
        {pathname == "/" && (
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
                  <Switch>
                    <Route exact path={ROUTES.HOME} component={Home} />
                    <Route
                      path={`${ROUTES.BROWSE_DECKS_FOR}/:faction`}
                      render={(props) => <Decks {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.CARDS_LIBRARY}
                      render={(props) => <Library {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.CREATOR_ROOT}
                      render={(props) => <DeckCreator {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.SIGN_IN}
                      render={(props) => <Login {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.SIGN_UP}
                      render={(props) => <SignUp {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.VIEW_DECK_ID}
                      render={(props) => <Deck {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.VIEW_CARD_ID}
                      render={(props) => <Card {...(props as any)} />}
                    />

                    <Route
                      path={ROUTES.PRIVACY_POLICY}
                      render={(props) => <PrivacyPolicy {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.PASSWORD_RESET}
                      render={(props) => <PasswordResetRequest {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.MY_DECKS}
                      render={(props) => <MyDecks {...(props as any)} />}
                    />
                    <Route
                      path={ROUTES.BOARDS}
                      render={(props) => <BoardsPage {...(props as any)} />}
                    />
                    <Route path={ROUTES.PROFILE} component={UserProfile} />
                  </Switch>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

const modalRoot = document.getElementById("modal-root");
export class ModalPresenter extends React.Component<React.PropsWithChildren<object>> {
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
        <Router>
          <MainLayout />
        </Router>
      </AuthContextProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </PersistQueryClientProvider>
  </FirebaseContext.Provider>
);

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
