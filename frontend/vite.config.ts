import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { API_URL } from './src/config';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
    minify: true
  },
  base: '/',
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
});