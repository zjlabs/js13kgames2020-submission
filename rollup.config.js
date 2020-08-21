// rollup.config.js (building more than one bundle)
export default [
  {
    input: 'public/client/index.js',
    output: {
      file: 'public/client.js',
      format: 'umd',
    },
  },
  {
    input: 'public/server/index.js',
    output: {
      file: 'public/server.js',
      format: 'umd',
    },
  },
  {
    input: 'public/shared/index.js',
    output: {
      file: 'public/shared.js',
      format: 'umd',
    },
  },
];
