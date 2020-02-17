const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const devServerOptions = Object.assign({}, webpackConfig.devServer, {
  stats: {
    colors: true
  }
});
const server = new WebpackDevServer(Webpack(webpackConfig), devServerOptions);
const port = devServerOptions.port || '8080';

server.listen(port, '0.0.0.0', () => {
  console.log(`Starting server on http://localhost:${port}`);
});
