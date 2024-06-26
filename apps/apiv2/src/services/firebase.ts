import admin from "firebase-admin";

let app: ReturnType<typeof admin.initializeApp>;

export const firebase = () => {
  if (app) return app;

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  return app;
};

export const auth = firebase().auth();
