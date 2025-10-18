import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env vars based on current mode (development / production)
  const env = loadEnv(mode, process.cwd(), '')


  const targetPath = env.VITE_TARGET_PATH || '/var/www/html/app'
  const basePath = env.VITE_BASE_PATH || '/'

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [vue()],
    base: mode === 'production' ? basePath : '/',
    build: {
      outDir: targetPath, // destination folder for build
      emptyOutDir: true,
    },
  }
})
