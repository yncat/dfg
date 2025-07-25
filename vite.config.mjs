import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/softs/dfg/game/',
  build: {
    outDir: 'build',
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'es'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['colyseus.js', 'howler', 'js-cookie']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})