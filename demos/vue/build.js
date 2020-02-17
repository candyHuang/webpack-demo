const fs = require('fs');
const path = require('path');
const Webpack = require('webpack');
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
      chunks: false, // Makes the build much quieter
      colors: true, // Shows colors in the console
      modules: false,
      entrypoints: false
    })
  );

  const state = stats.toJson({
    // modules: true,
    // chunks: false,
    // assets: false,
    // entrypoints: false
  });
  // const EXTERNAL_REG = /^external "(\w+)"$/;
  // console.log('-----------------------');
  // state.modules
  //   .filter(el => EXTERNAL_REG.test(el.name))
  //   .forEach(el => {
  //     console.log('externals module:', el.name.match(EXTERNAL_REG)[1]);
  //   });
  // console.log('-----------------------');

  // write in file
  fs.writeFile(path.resolve(__dirname, 'dist/stats.json'), JSON.stringify(state, null, 2), function(
    err
  ) {
    if (err) {
      console.error(err);
    }
    console.log('----------file wirte success: dist/stats.json-------------');
  });
});
