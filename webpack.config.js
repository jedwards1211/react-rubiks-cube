var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel/polyfill',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'main.js',
    publicPath: '/assets/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel?stage=0',
        exclude: /node_modules/,
      }, 
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, 
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?indentedSyntax&outputStyle=expanded',
        exclude: /node_modules/,
      }, 
    ],
  },
};
