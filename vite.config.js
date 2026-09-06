import { defineConfig } from 'vite';
import { globSync } from 'node:fs';
import path from 'node:path';

/* Chaque page projet est un point d'entrée : Vite les construit toutes. */
const pages = Object.fromEntries(
  globSync('projets/**/index.html').map((f) => [f.replace(/[\/]/g, '_'), path.resolve(f)]),
);

export default defineConfig({
  server: { port: 5820, strictPort: true, open: false },
  build: {
    target: 'es2020',
    rollupOptions: { input: { main: path.resolve('index.html'), ...pages } },
  },
});
