import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'public/client/index.ts',
    watch: 'public/{client,shared}/**.(js|ts)',
    output: {
      file: 'public/client.js',
      format: 'iife',
    },
    plugins: [typescript(), terser()],
  },
  {
    input: 'public/server/index.js',
    watch: 'public/{server,shared}/**.js',
    output: {
      file: 'public/server.js',
      format: 'umd',
    },
    plugins: [terser()],
  },
];
