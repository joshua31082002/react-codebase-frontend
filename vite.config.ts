import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
  ],
  // Change the prefix from 'VITE_' to 'APP_'
  envPrefix: 'APP_',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname)],
        additionalData: `@use "src/styles/abstracts" as *;
        `,
      },
    },
  },
});
