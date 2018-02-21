const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  module: {
    // https://github.com/mapbox/mapbox-gl-js/issues/4359
    noParse: /(mapbox-gl)\.js$/,
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
});
