import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/postcss';
import { config } from 'dotenv';

config({ path: '.env.local' });

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    binaries: {
      ...(process.env.WXT_CHROME_BINARY ? { chrome: process.env.WXT_CHROME_BINARY } : {}),
    },
    ...(process.env.WXT_START_URL ? { startUrls: [process.env.WXT_START_URL] } : {}),
  },
  manifest: {
    name: 'Assistente NFS-e',
    description: 'Totaliza os valores das notas fiscais emitidas no portal nfse.gov.br',
    version: '1.0.0',
    permissions: ['tabs'],
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  }),
});
