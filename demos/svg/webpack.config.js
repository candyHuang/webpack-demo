const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
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
        test: /\.(svg)(\?.*)?$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: [
              {
                loader: 'svg-inline-loader'
              }
            ]
          },
          {
            resourceQuery: /sprite/,
            use: [
              {
                loader: 'svg-sprite-loader',
                options: {
                  symbolId: 'icon-[name]'
                }
              }
            ]
          },
          {
            resourceQuery: /fixed/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[ext]'
                }
              }
            ]
          },
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};
