import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'public/client/index.ts',
    watch: 'public/{client,shared}/**/*.*',
    output: {
      file: 'public/client.js',
      format: 'iife',
      sourcemap: 'inline',
    },
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
            inlineSourceMap: false,
            module: 'ES2015',
          },
        },
      }),
      // terser(),
    ],
  },
  {
    input: 'public/server/index.js',
    watch: 'public/{server,shared}/**.js',
    output: {
      file: 'public/server.js',
      format: 'umd',
    },
    plugins: [
      // terser()
    ],
  },
];
