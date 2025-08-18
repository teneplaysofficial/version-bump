import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    minify: true,
    format: ['esm', 'cjs'],
    dts: true,
    treeshake: true,
    target: 'node20',
    shims: true,
  },
  {
    entry: ['bin/index.ts'],
    outDir: 'dist/cli',
    minify: true,
    format: ['cjs'],
    treeshake: true,
    target: 'node20',
    shims: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
