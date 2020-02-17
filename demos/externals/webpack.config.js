const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BootHtmlPlugin = require('../../plugins/boot-html-plugin');

module.exports = {
  // mode: 'development',
  mode: 'none',
  // mode: 'production',
  entry: {
    demo: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.less']
  },
  externals: {
    vue: 'Vue'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ns/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // enable sub-packages to find babel config
          options: {
            rootMode: 'upward'
          }
        }
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(), new BootHtmlPlugin()]
};
