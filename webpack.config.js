var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './build',
    filename: '[hash:6].app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      verbose: true
    }),
    new HtmlWebpackPlugin({
      title: 'Cycle.js',
      template: './src/index.html',
      inject: 'body'
    })
  ]
};
