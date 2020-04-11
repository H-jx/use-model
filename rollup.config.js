import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import rollupTypescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    name: 'useModel'
  },
  plugins: [
    resolve(),
    rollupTypescript(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify(),
  ],
  external: ['react']
};