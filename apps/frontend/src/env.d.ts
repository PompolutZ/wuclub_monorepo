/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_AUTH_DOMAIN: string; 
    readonly VITE_DATABASE_URL: string; 
    readonly VITE_PROJECT_ID: string; 
    readonly VITE_STORAGE_BUCKET: string;
    readonly VITE_MESSAGING_SENDER_ID: number;
    readonly VITE_APP_ID: string;
    readonly VITE_MEASUREMENT_ID: string;
    readonly VITE_WUNDERWORLDS_API_ORIGIN: string;
    readonly VITE_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
