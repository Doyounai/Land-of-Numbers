const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const webpack = require('webpack');

const dev = {
  mode: 'development',
  stats: 'errors-warnings',
  devtool: 'eval',
  devServer: {
    compress: true,
    port: 8080,
    https: true
  },
  plugins: [
    new webpack.DefinePlugin({
        'CANVAS_RENDERER': JSON.stringify(true),
        'WEBGL_RENDERER': JSON.stringify(true),
        'PLUGIN_FBINSTANT': JSON.stringify(true)
    })
]
}

module.exports = merge(common, dev)