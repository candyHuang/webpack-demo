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
      console.log('----------file wirte success-------------');
    }
  );
});
