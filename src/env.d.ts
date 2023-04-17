/// <reference types="vite/client" />

interface ImportMetaEnv {
  // more env variables...
  readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
