import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    binaries: {
      ...(process.env.WXT_CHROME_BINARY ? { chrome: process.env.WXT_CHROME_BINARY } : {}),
    },
  },
  manifest: {
    name: 'Assistente NFS-e',
    description: 'Totaliza os valores das notas fiscais emitidas no portal nfse.gov.br',
    version: '1.0.0',
    permissions: ['tabs'],
  },
});
