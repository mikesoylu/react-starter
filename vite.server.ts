import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ReactCompilerConfig = {};

export default defineConfig(async ({ mode }) => {
  console.log('[defineConfig] mode', mode);

  const plugins = [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ];

  return {
    plugins,
    build: {
      rollupOptions: {
        output: {
          // don't use hashes in filenames for server
          entryFileNames: `[name].mjs`,
        },
      },
    },
  };
});
