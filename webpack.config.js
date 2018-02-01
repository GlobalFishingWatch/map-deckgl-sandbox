
const resolve = require('path').resolve;
const webpack = require('webpack');

const CONFIG = {
  entry: {
    app: resolve('./app.js')
  },

  devtool: 'source-map',

  module: {
    rules: [{
      // Compile ES2015 using buble
      test: /\.js$/,
      loader: 'buble-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        objectAssign: 'Object.assign',
        transforms: { dangerousForOf: true },
      },

    }]
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  plugins: [

  ]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = CONFIG;
