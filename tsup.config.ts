import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  sourcemap: false,
  minify: true,
  format: ['esm', 'cjs'],
  dts: true,
  treeshake: true,
  target: 'node20',
  shims: true,
});
