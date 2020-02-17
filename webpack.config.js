const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MyPlugin = require('./plugins/myplugin.js');

module.exports = {
  // mode: 'development',
  mode: 'none',
  // mode: 'production',
  entry: {
    demo: './src/index.js'
  },
  externals: {
    vue: 'Vue'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.less'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ns/[name].js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     //这里是我的自定义loader的存放路径
      //     loader: path.resolve('./loaders/index.js'),
      //     options: {
      //       test: 1
      //     }
      //   }
      // }
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
  plugins: [
    new CleanWebpackPlugin()
    // new MyPlugin('Plugin is instancing.')
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '../src/index.tpl.html')
    // })
  ],
  performance: {
    // maxEntrypointSize: 25000000000 // 250000
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 3000000, // 30kb  30000
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true
    }
  }
};
