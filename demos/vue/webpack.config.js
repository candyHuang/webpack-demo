const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackHelper = require('../../webpack-helper');
const BootHtmlPlugin = require('../../plugins/boot-html-plugin');

const nodeEnv = process.env.NODE_ENV;

module.exports = {
  // mode: 'development',
  // mode: 'production',
  mode: nodeEnv || 'development',
  entry: {
    demo: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.less']
  },
  externals: {
    vue: 'Vue',
    vant: 'vant'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ns/[name].js'
  },
  devServer: {
    hot: true,
    disableHostCheck: true,
    progress: false,
    stats: 'errors-only'
  },
  module: {
    rules: [
      webpackHelper.getRule('vue'),
      webpackHelper.getRule('js'),
      webpackHelper.getRule('ts'),
      webpackHelper.getRule('media'),
      webpackHelper.getRule('fonts'),
      webpackHelper.getRule('image'),
      webpackHelper.getRule('svg'),
      webpackHelper.getRule('css'),
      webpackHelper.getRule('less')
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            mergeLonghand: false,
            cssDeclarationSorter: false
          }
        ]
      }
    }),
    new HtmlWebpackPlugin({
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
      },
      templateParameters: {
        title: '咪咕音乐'
      },
      inject: false,
      template: path.join(__dirname, './index.ejs')
    }),
    new BootHtmlPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../../booter.js'),
        to: path.join(__dirname, './dist'),
        ignore: ['.*']
      }
    ])
  ]
};
