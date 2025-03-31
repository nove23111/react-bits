import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import safeParser from 'postcss-safe-parser'

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'

// Convert import.meta.url to __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@content': path.resolve(__dirname, 'src/content'),
      '@tailwind': path.resolve(__dirname, 'src/tailwind'),
      '@ts-default': path.resolve(__dirname, 'src/ts-default'),
      '@ts-tailwind': path.resolve(__dirname, 'src/ts-tailwind'),
    },
  },
  css: {
    postcss: {
      parser: safeParser
    }
  },
  assetsInclude: ['**/*.glb', '**/*.wasm'],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util', '@ffmpeg/core'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ffmpeg: ['@ffmpeg/ffmpeg'],
        },
      },
    },
  },
})
