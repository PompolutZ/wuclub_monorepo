declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_PASSWORD: string;
      DATABASE_NAME: string;
    }
  }
}

export {};
