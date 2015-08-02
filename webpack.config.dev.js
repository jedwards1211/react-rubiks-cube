var webpack = require('webpack');
var _ = require('lodash');

var config = require('./webpack.config');
var devProps = require('./devProps');

var config = module.exports = _.assign(_.cloneDeep(config), {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?' + devProps.baseUrl,
    'webpack/hot/only-dev-server',
  ].concat(config.entry),
  output: _.assign(_.cloneDeep(config.output), {
    publicPath: devProps.baseUrl + '/assets/',
  }),
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.PrefetchPlugin('react/addons'),
  ],
});

// inject react-hot loader

var jsLoader = _.find(config.module.loaders, function(loader) {
  return loader.test.test('.js');
});

if (jsLoader) {
  jsLoader.loader = 'react-hot!' + jsLoader.loader;
}