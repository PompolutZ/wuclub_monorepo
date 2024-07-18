declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_PASSWORD: string;
      DATABASE_NAME: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_DATABASE_URL: string;
    }
  }
}

export {};
