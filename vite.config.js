import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: './src/widget/index.js',
      name: 'TimeBidWidget',
      fileName: (format) => `timebid-widget.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    minify: 'terser'
  }
});
