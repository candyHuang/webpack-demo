const fs = require('fs');
const path = require('path');
const Webpack = require('webpack');

// const SVGO = require('svgo');
// const filepath = 'src/coat.svg';
// const svgo = new SVGO({
//   plugins: [
//     {
//       cleanupAttrs: true
//     },
//     {
//       removeDoctype: true
//     },
//     {
//       removeXMLProcInst: true
//     },
//     {
//       removeComments: true
//     },
//     {
//       removeMetadata: true
//     },
//     {
//       removeTitle: true
//     },
//     {
//       removeDesc: true
//     },
//     {
//       removeUselessDefs: true
//     },
//     {
//       removeEditorsNSData: true
//     },
//     {
//       removeEmptyAttrs: true
//     },
//     {
//       removeHiddenElems: true
//     },
//     {
//       removeEmptyText: true
//     },
//     {
//       removeEmptyContainers: true
//     },
//     {
//       removeViewBox: false
//     },
//     {
//       cleanupEnableBackground: true
//     },
//     {
//       convertStyleToAttrs: true
//     },
//     {
//       convertColors: true
//     },
//     {
//       convertPathData: true
//     },
//     {
//       convertTransform: true
//     },
//     {
//       removeUnknownsAndDefaults: true
//     },
//     {
//       removeNonInheritableGroupAttrs: true
//     },
//     {
//       removeUselessStrokeAndFill: true
//     },
//     {
//       removeUnusedNS: true
//     },
//     {
//       cleanupIDs: true
//     },
//     {
//       cleanupNumericValues: true
//     },
//     {
//       moveElemsAttrsToGroup: true
//     },
//     {
//       moveGroupAttrsToElems: true
//     },
//     {
//       collapseGroups: true
//     },
//     {
//       removeRasterImages: false
//     },
//     {
//       mergePaths: true
//     },
//     {
//       convertShapeToPath: true
//     },
//     {
//       sortAttrs: true
//     },
//     {
//       removeDimensions: true
//     },
//     {
//       removeAttrs: { attrs: '(stroke|fill)' }
//     }
//   ]
// });
// fs.readFile(filepath, 'utf8', function(err, data) {
//   if (err) {
//     throw err;
//   }
//   svgo.optimize(data, { path: filepath }).then(function(result) {
//     fs.writeFileSync(filepath, result.data);
//   });
// });

const webpackConfig = require('./webpack.config');
const compiler = Webpack(webpackConfig);

compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  if (stats.hasErrors()) {
    console.log(stats.toJson().errors[0]);
    return;
  }
  console.log(
    stats.toString({
      chunks: !false, // Makes the build much quieter
      colors: true // Shows colors in the console
    })
  );
  // write in file
  fs.writeFile(
    path.resolve(__dirname, 'dist/stats.json'),
    JSON.stringify(stats.toJson(), null, 2),
    function(err, data) {
      if (err) {
        console.error(err);
      }
      console.log('----------file wirte success: dist/stats.json-------------');
    }
  );
});
