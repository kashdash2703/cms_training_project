import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const backendUrl = env['BACKEND_URL'] || 'http://localhost:3000';

  return {
    root: rootDir,
    plugins: [react()],
    publicDir: 'src/frontend/public',
    build: {
      outDir: 'dist/frontend',
    },
    server: {
      host: env['FRONTEND_HOST'] || 'localhost',
      port: Number(env['FRONTEND_PORT'] || 5173),
      proxy: {
        '^/api(/|$)': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api(?=\/|$)/, ''),
        },
      },
    },
  };
});
