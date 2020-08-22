import { terser } from 'rollup-plugin-terser';
export default [
  {
    input: 'public/client/index.js',
    watch: 'public/{client,shared}/**.js',
    output: {
      file: 'public/client.js',
      format: 'umd',
    },
    plugins: [terser()],
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
