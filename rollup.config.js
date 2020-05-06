import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import rollupTypescript from 'rollup-plugin-typescript2'

const ENV = process.env.NODE_ENV;

const config = {
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
  ],
  external: ['react']
}
if (ENV.endsWith(':min')) {
  config.output.file = 'dist/index.js'
  config.plugins.push(uglify())
} else if (ENV.endsWith(':es')) {
  config.output.file = 'es/index.js'
  config.output.format = 'es'
}
export default config