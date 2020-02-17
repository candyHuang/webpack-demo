const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    vue: 'Vue',
    uppercamelcase: 'upperCamelcase'
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
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          // {
          //   loader: 'style-loader'
          // },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    new HtmlWebpackPlugin({
      // templateContent: function(templateParams, compilation) {
      //   // Return your template content synchronously here
      //   return '..';
      // },
      templateParameters: {
        foo: 'bar'
      },
      // inject: false
      template: path.join(__dirname, './index.ejs')
    })
    // new BootHtmlPlugin()
  ]
};
