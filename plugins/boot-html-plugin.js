const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

class BootHtmlPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('BootHtmlPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'BootHtmlPlugin',
        (data, cb) => {
          const templateParameters = data.plugin.options.templateParameters || {};
          templateParameters.__BOOTER_CONFIG__ = '';
          const assetsRoadmap = analysisAssets(compilation);
          templateParameters.__BOOTER_CONFIG__ = `
            {
              presets: ${JSON.stringify(assetsRoadmap.presets)},
              entrypoints: ${JSON.stringify(assetsRoadmap.entrypoints)},
            }
          `.replace(/\s+/g, ' ');
          data.plugin.options.templateParameters = templateParameters;
          cb(null, data);
        }
      );
    });

    compiler.hooks.emit.tap('BootHtmlPlugin', compilation => {
      // getPresetModule(compilation);
      return true;
    });

    compiler.hooks.done.tap('BootHtmlPlugin', stats => {
      // fs.writeFile(
      //   'manifest.json',
      //   JSON.stringify(stats.toJson(), null, 2),
      //   { flag: 'w+' },
      //   function() {
      //     console.log('BootHtmlPlugin DONE');
      //   }
      // );
    });

    //   //   // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
    //   //   // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
    //   //   // 该 Chunk 就会生成 .js 和 .css 两个文件
    //   //   chunk.files.forEach(function(filename) {
    //   //     // compilation.assets 存放当前所有即将输出的资源
    //   //     // 调用一个输出资源的 source() 方法能获取到输出资源的内容
    //   //     let source = compilation.assets[filename].source();
    //   //   });
    //   // });
  }
}

function analysisAssets(compilation) {
  const rs = {
    presets: [],
    entrypoints: []
  };
  const stats = compilation.getStats().toJson({
    modules: true,
    entrypoints: true,
    chunks: false,
    assets: false
  });
  // external preset
  const EXTERNAL_REG = /^external "(\w+)"$/;
  rs.presets = stats.modules
    .filter(el => EXTERNAL_REG.test(el.name))
    .map(el => el.name.match(EXTERNAL_REG)[1].toLowerCase());
  // entrypoints
  Object.keys(stats.entrypoints).forEach(name => {
    const entry = stats.entrypoints[name];
    rs.entrypoints = rs.entrypoints.concat(entry.assets);
  });

  return rs;
}

module.exports = BootHtmlPlugin;

// class MyPlugin {
//   apply(compiler) {
//     compiler.hooks.compilation.tap('MyPlugin', compilation => {
//       console.log('The compiler is starting a new compilation...');

//       // Static Plugin interface |compilation |HOOK NAME | register listener
//       HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
//         'MyPlugin', // <-- Set a meaningful name here for stacktraces
//         (data, cb) => {
//           // Manipulate the content
//           data.html += 'The Magic Footer';
//           // Tell webpack to move on
//           cb(null, data);
//         }
//       );

//       HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tap('MyPlugin', data => {
//         console.log('AsyncSeriesWaterfallHook', data, cb);
//       });
//     });
//   }
// }

// module.exports = MyPlugin
