import React, { useState, useEffect, useContext, createContext } from "react";
import { ADMIN_ROLE, PLAYER_ROLE } from "@fxdxpz/schema";
import { FirebaseContext } from "../firebase";

export type AuthUser = Record<string, unknown> & {
  uid?: string;
  role?: string[];
};

export type AuthState = {
  // false while we're waiting for Firebase's first onAuthStateChanged emit.
  isInitialized: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  isPlayer: boolean;
};

const INITIAL_STATE: AuthState = {
  isInitialized: false,
  user: null,
  isAdmin: false,
  isPlayer: false,
};

// Module-level mirror of the latest auth state so non-React consumers
// (router beforeLoad, etc.) can read it without going through context.
let latestState: AuthState = INITIAL_STATE;

let resolveReady: () => void = () => {};
let readyResolved = false;

// Resolves on the first Firebase onAuthStateChanged emit (success OR error).
// Gated routes await this in beforeLoad so the public routes can render
// immediately without paying for an auth round-trip.
export const authReady: Promise<void> = new Promise((res) => {
  resolveReady = res;
});

export const getAuthState = (): AuthState => latestState;

const AuthStateContext = createContext<AuthState | undefined>(undefined);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const cached = JSON.parse(
      localStorage.getItem("yawudb_authUser") ?? "null",
    ) as AuthUser | null;
    // Cached user hydrates UI immediately; Firebase will confirm or clear.
    const initial: AuthState = {
      isInitialized: false,
      user: cached,
      isAdmin: Boolean(cached?.role?.includes(ADMIN_ROLE)),
      isPlayer: Boolean(cached?.role?.includes(PLAYER_ROLE)),
    };
    latestState = initial;
    return initial;
  });
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const markReady = () => {
      if (!readyResolved) {
        readyResolved = true;
        resolveReady();
      }
    };

    const releaseAuthListener = firebase.onAuthUserListener(
      (authUser) => {
        localStorage.setItem("yawudb_authUser", JSON.stringify(authUser));
        const user = authUser as AuthUser;
        const next: AuthState = {
          isInitialized: true,
          user,
          isAdmin: Boolean(user?.role?.includes(ADMIN_ROLE)),
          isPlayer: Boolean(user?.role?.includes(PLAYER_ROLE)),
        };
        latestState = next;
        setState(next);
        markReady();
      },
      () => {
        localStorage.removeItem("yawudb_authUser");
        const next: AuthState = {
          isInitialized: true,
          user: null,
          isAdmin: false,
          isPlayer: false,
        };
        latestState = next;
        setState(next);
        markReady();
      },
    );

    return () => {
      releaseAuthListener?.();
    };
  }, [firebase]);

  return (
    <AuthStateContext.Provider value={state}>
      {children}
    </AuthStateContext.Provider>
  );
}

function useAuthState(): AuthState {
  const state = useContext(AuthStateContext);
  if (state === undefined) {
    throw Error("useAuthState should be used within AuthContextProvider");
  }
  return state;
}

// Legacy hook — returns user-or-null for callers that only care about identity.
function useAuthUser(): AuthUser | null {
  return useAuthState().user;
}

export {
  AuthContextProvider,
  useAuthState,
  INITIAL_STATE as INITIAL_AUTH_STATE,
};

export default useAuthUser;
