const {buildSync} = require('esbuild')

buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: 'dist/hot-plate.esm.min.js'
})

buildSync({
  entryPoints: ['scripts/iife-wrapper.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'HotPlate',
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: 'dist/hot-plate.iife.min.js'
})
