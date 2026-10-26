import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'react-build', emptyOutDir: true, manifest: true,
    rollupOptions: { input: resolve(process.cwd(), 'react/index.html') } }
});
