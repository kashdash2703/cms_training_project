import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = process.env.BACKEND_URL
  
  return {
    root: 'src/frontend',
    server: {
      port: Number(env['FRONTEND_PORT'] || 5173),
      proxy: {
        '/api': {
         target: backendUrl,
         rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})