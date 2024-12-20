/// <reference types="vitest/config" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
   test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.ts',
      css: true,
      coverage: {
         provider: 'istanbul',
      },
      exclude: [...configDefaults.exclude, 'src/tests/\\e2e\\/*'],
   },
   resolve: {
      alias: {
         '@': resolve(__dirname, 'src'),
      },
   },
   css: {
      postcss: {
         plugins: [tailwindcss(), autoprefixer()],
      },

      preprocessorOptions: {
         scss: {
            api: 'modern-compiler',
         },
      },
   },
});
