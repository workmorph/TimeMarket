import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.ts'),
      name: 'TimeBidWidget',
      fileName: (format) => `timebid-widget.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        manualChunks: undefined
      }
    },
    sourcemap: true,
    minify: 'terser',
    outDir: 'dist/widget',
    emptyOutDir: true,
    target: 'es2015'
  }
});
