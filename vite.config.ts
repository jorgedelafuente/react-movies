/// <reference types="vitest/config" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';
import { resolve } from 'node:path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               'vendor-react': ['react', 'react-dom'],
               'vendor-router': [
                  '@tanstack/react-router',
                  '@tanstack/router-devtools',
               ],
               'vendor-query': [
                  '@tanstack/react-query',
                  '@tanstack/react-query-devtools',
               ],
               'vendor-supabase': ['@supabase/supabase-js'],
            },
         },
      },
   },
   test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.ts',
      css: true,
      env: {
         VITE_APIKEY: 'test-api-key',
         VITE_SUPABASE_URL: 'http://localhost',
         VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key',
      },
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
   },
});
