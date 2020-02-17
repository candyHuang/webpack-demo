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
        test: /\.(png|jpe?g|gif|webp)$/,
        oneOf: [
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
            resourceQuery: /inline/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  fallback: {
                    loader: 'file-loader',
                    options: {
                      name: 'img/[name].[hash:8].[ext]'
                    }
                  }
                }
              }
            ]
          },
          {
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 4096, // 4kb
                  fallback: {
                    loader: 'file-loader',
                    options: {
                      name: 'img/[name].[hash:8].[ext]'
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
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
  },
  plugins: [new CleanWebpackPlugin()]
};
