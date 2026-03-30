import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import type { Unsubscribe, UserCredential } from "firebase/auth";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword as authCreateWithEmailAndPassword,
  signInWithEmailAndPassword as authSignInWithEmailAndPassword,
  signOut as authSignOut,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { api } from "@/services/api";
import { logger } from "@/utils/logger";

const config = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
  databaseURL: import.meta.env.VITE_DATABASE_URL as string,
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET as string,
  messagingSenderId: String(import.meta.env.VITE_MESSAGING_SENDER_ID),
  appId: import.meta.env.VITE_APP_ID as string,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID as string,
};

type AuthUserCallback = (user: Record<string, unknown>) => void;
type FallbackCallback = () => void;

interface FirebaseInstance {
  signInWithFacebookProvider: () => Promise<never>;
  signInWithGoogleProvider: () => Promise<UserCredential>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  getTokenId: () => Promise<string>;
  getRedirectResult: () => Promise<UserCredential | null>;
  onAuthUserListener: (next: AuthUserCallback, fallback: FallbackCallback) => Unsubscribe;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const Firebase2 = (function (): FirebaseInstance {
  if (!config.apiKey) {
    logger.warn("Firebase is not configured. No auth listener will be set.");
    return {
      signInWithFacebookProvider: () => Promise.resolve() as never,
      signInWithGoogleProvider: () => Promise.resolve() as never,
      signInWithEmailAndPassword: () => Promise.resolve() as never,
      createUserWithEmailAndPassword: () => Promise.resolve() as never,
      signOut: () => Promise.resolve(),
      getTokenId: () => Promise.resolve(""),
      getRedirectResult: () => Promise.resolve(null),
      onAuthUserListener: (_next, fallback) => { fallback(); return () => {}; },
      sendPasswordResetEmail: () => Promise.resolve(),
    };
  }

  const app = initializeApp(config);
  getAnalytics(app);
  const auth = getAuth(app);

  return {
    signInWithFacebookProvider: function signInWithFacebookProvider() {
      return signInWithRedirect(auth, new FacebookAuthProvider()) as never;
    },

    signInWithGoogleProvider: async function signInWithGoogleProvider() {
      return signInWithPopup(auth, new GoogleAuthProvider());
    },

    signInWithEmailAndPassword: function signInWithEmailAndPassword(
      email: string,
      password: string,
    ) {
      return authSignInWithEmailAndPassword(auth, email, password);
    },

    createUserWithEmailAndPassword: function createUserWithEmailAndPassword(
      email: string,
      password: string,
    ) {
      return authCreateWithEmailAndPassword(auth, email, password);
    },

    signOut: function signOut() {
      return authSignOut(auth);
    },

    getTokenId: function getTokenId() {
      return new Promise<string>((res, rej) => {
        const user = auth.currentUser;
        if (user) {
          user
            .getIdToken()
            .then((token) => res(token))
            .catch((e) => rej(e));
        } else {
          rej("Anon");
        }
      });
    },

    getRedirectResult() {
      return getRedirectResult(auth);
    },

    onAuthUserListener: function onAuthUserListener(
      next: AuthUserCallback,
      fallback: FallbackCallback,
    ) {
      return onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const response = await api.v2.users.$get(undefined, {
              headers: {
                authtoken: token,
              },
            });
            const userInfo = await response.json();

            if (userInfo) {
              next({
                ...userInfo,
                uid: user.uid,
                isNew: false,
              });
            } else {
              next({
                uid: user.uid,
                isNew: true,
              });
            }
          } else {
            logger.info("No authenticated user, using fallback");
            fallback();
          }
        },
        (error) => {
          logger.error("Authentication error", error);
          fallback();
        },
      );
    },

    sendPasswordResetEmail: function invokeSendPasswordResetEmail(email: string) {
      return sendPasswordResetEmail(auth, email);
    },
  };
})();

export default Firebase2;
