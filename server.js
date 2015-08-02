var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var devProps = require('./devProps');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: __dirname,
}).listen(devProps.port, devProps.host, function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at ' + devProps.baseUrl);
});
