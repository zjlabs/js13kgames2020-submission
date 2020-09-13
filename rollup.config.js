import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
const tops = {
  keep_classnames: true,
};

export default [
  {
    input: 'public/client/index.ts',
    watch: 'public/{client,shared}/**/*.*',
    output: {
      file: 'public/client.js',
      format: 'iife',
    },
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: false,
            inlineSourceMap: false,
            module: 'ES2015',
          },
        },
      }),
      terser(tops),
    ],
  },
  {
    input: 'public/server/index.js',
    watch: 'public/{server,shared}/**.js',
    output: {
      file: 'public/server.js',
      format: 'umd',
    },
    plugins: [terser(tops)],
  },
];
