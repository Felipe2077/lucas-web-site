import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './', // Para caminhos relativos
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          sanity: ['@sanity/client', '@sanity/image-url'],
        },
      },
    },
  },
  publicDir: 'public',
  server: {
    host: true,
  },
});
