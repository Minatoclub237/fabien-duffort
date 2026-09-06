import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5820, strictPort: true, open: false },
  build: { target: 'es2020' },
});
