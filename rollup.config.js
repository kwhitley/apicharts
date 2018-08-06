// NOTE: rollup.js is only used for building the server code for production
import babel from 'rollup-plugin-babel'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  input: './src/redux-automap.js',
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'react'],
      plugins: ['external-helpers', 'transform-runtime', 'transform-object-rest-spread'],
    }),
  ],
  external,
  output: [
    {
      file: './dist/redux-automap.js',
      format: 'cjs',
      sourceMap: true
    }
  ]
}
