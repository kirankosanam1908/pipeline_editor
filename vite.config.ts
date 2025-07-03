
import tailwindcss from '@tailwindcss/vite'


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react(),tailwindcss()],
  root: __dirname,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'reactflow'],
          utils: ['dagre']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
