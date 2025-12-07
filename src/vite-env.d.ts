/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly APP_ENV: string;
  readonly APP_VERSION: string;
  readonly APP_API_SERVICE_BASEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
