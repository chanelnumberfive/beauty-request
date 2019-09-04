const webpack = require('webpack');
const path = require('path');
function generateConfig(name) {
  var uglify = name.indexOf('min') > -1;
  var config = {
    entry: './index.js',
    output: {
      path: path.join(__dirname, './build'),
      filename: name + '.js',
      sourceMapFilename: name + '.map',
      library: 'BeautyRequest',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    mode: 'development',
    devtool: 'source-map'
  };

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ];

  if (uglify) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    );
  }

  return config;
}
module.exports = generateConfig('beauty-request');