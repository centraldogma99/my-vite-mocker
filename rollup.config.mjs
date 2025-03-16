import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'tsc/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  external: ['rollup'],
  plugins: [
    nodeResolve({
      extensions: ['.ts', '.js']
    }),
    commonjs()
  ]
}; 