/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WMS_USER?: string;
  readonly VITE_WMS_PASS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
