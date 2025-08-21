/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __filename = fileURLToPath(import.meta.url);
const __dirnameApp = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base : '/tv-explorer/',
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirnameApp, 'src'),
      '@components': path.resolve(__dirnameApp, 'src/components'),
      '@views': path.resolve(__dirnameApp, 'src/views'),
      '@assets': path.resolve(__dirnameApp, 'src/assets'),
      '@styles': path.resolve(__dirnameApp, 'src/styles'),
      '@utils': path.resolve(__dirnameApp, 'src/utils'),
      '@store': path.resolve(__dirnameApp, 'src/store'),
      '@api': path.resolve(__dirnameApp, 'src/api'),
      '@services': path.resolve(__dirnameApp, 'src/services'),
      '@composables': path.resolve(__dirnameApp, 'src/composables'),
    }
  },
  test: {
    projects: [
      {
        test : {
          name: 'unit',
           environment: 'jsdom',   
          globals: true,
          setupFiles: ['src/tests/setup.unit.ts'],
          exclude: ['tests/storybook/**', 'node_modules/**'],
          
        }
      },
      // Storybook tests
      {
        extends: true,
        plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
  
  ]
  }
});