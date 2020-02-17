const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MAX_INLINE_SIZE = 4096; // 4kb
const IMAGE_PREFIX = 'img';
const MEDIA_PREFIX = 'media';
const FONTS_PREFIX = 'fonts';
const HASHED_NAME = '[name].[hash:8].[ext]';
const SVG_SYMBOL_ID = 'icon-[name]';

const rules = {
  getRuleMedia: function() {
    return {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: MAX_INLINE_SIZE,
            fallback: {
              loader: 'file-loader',
              options: {
                name: `${MEDIA_PREFIX}/${HASHED_NAME}`
              }
            }
          }
        }
      ]
    };
  },

  getRuleFonts: function() {
    return {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: MAX_INLINE_SIZE,
            fallback: {
              loader: 'file-loader',
              options: {
                name: `${FONTS_PREFIX}/${HASHED_NAME}`
              }
            }
          }
        }
      ]
    };
  },

  getRuleImage: function() {
    return {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      oneOf: [
        {
          resourceQuery: /fixed/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${IMAGE_PREFIX}/[name].[ext]`
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
                    name: `${IMAGE_PREFIX}/${HASHED_NAME}`
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
                limit: MAX_INLINE_SIZE,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: `${IMAGE_PREFIX}/${HASHED_NAME}`
                  }
                }
              }
            }
          ]
        }
      ]
    };
  },

  getRuleSvg: function() {
    return {
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
                symbolId: SVG_SYMBOL_ID
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
                name: `${IMAGE_PREFIX}/[name].[ext]`
              }
            }
          ]
        },
        {
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${IMAGE_PREFIX}/${HASHED_NAME}`
              }
            }
          ]
        }
      ]
    };
  },

  getRuleCss: function() {
    return {
      test: /\.css$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: cssRuleByQuery('vue-module')
        },
        {
          resourceQuery: /\?vue/,
          use: cssRuleByQuery('vue')
        },
        {
          test: /\.module\.\w+$/,
          use: cssRuleByQuery('normal-module')
        },
        {
          use: cssRuleByQuery()
        }
      ]
    };
  },

  getRuleLess: function() {
    return {
      test: /\.less$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: lessRuleByQuery('vue-module')
        },
        {
          resourceQuery: /\?vue/,
          use: lessRuleByQuery('vue')
        },
        {
          test: /\.module\.\w+$/,
          use: lessRuleByQuery('normal-module')
        },
        {
          use: lessRuleByQuery()
        }
      ]
    };
  },

  getRuleVue: function() {
    return {
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }
      ]
    };
  },

  getRuleJs: function() {
    return {
      test: /\.m?jsx?$/,
      exclude: /node_modules/,
      use: babelRule()
    };
  },

  getRuleTs: function() {
    return {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: babelRule()
    };
  }
};

function cssRuleByQuery(query) {
  let cssLoaderOptions = {
    sourceMap: false,
    importLoaders: 2
  };
  if (query === 'vue-module' || query === 'normal-module') {
    cssLoaderOptions.modules = {
      localIdentName: '[name]_[local]_[hash:base64:5]'
    };
  }

  return [
    process.env.NODE_ENV === 'production'
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: false
          }
        }
      : {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
            shadowMode: false
          }
        },
    {
      loader: 'css-loader',
      options: cssLoaderOptions
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: false
      }
    }
  ];
}

function lessRuleByQuery(query) {
  const arr = cssRuleByQuery(query);
  arr.push({
    loader: 'less-loader',
    options: {
      sourceMap: false
    }
  });
  return arr;
}

function babelRule() {
  const useArr = [
    {
      loader: 'babel-loader',
      options: {
        rootMode: 'upward'
      }
    }
  ];
  if (process.env.NODE_ENV === 'production') {
    useArr.unshift({
      loader: 'thread-loader'
    });
  }
  return useArr;
}

module.exports = {
  getRule(type) {
    let rs = {};
    const ruleMethod = 'getRule' + type.substr(0, 1).toUpperCase() + type.substr(1).toLowerCase();
    if (typeof rules[ruleMethod] === 'function') {
      rs = rules[ruleMethod]();
    }
    return rs;
  }
};
