module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // useBuiltIns: 'usage',
        // corejs: 3
      }
      // {
      //   loose: true,
      //   modules: false
      // }
    ]
    // [
    //   '@vue/babel-preset-jsx',
    //   {
    //     functional: false
    //   }
    // ],
    // '@babel/preset-typescript'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        // corejs: 3,
        // helpers: true,
        regenerator: true
      }
    ]
    // [
    //   'import',
    //   {
    //     libraryName: 'agama',
    //     libraryDirectory: 'es',
    //     style: true
    //   },
    //   'agama'
    // ]
    // [
    //   'import',
    //   {
    //     libraryName: 'vant',
    //     // libraryDirectory: 'es',
    //     customName: name => {
    //       return 'vant';
    //       // // if (name === 'button') {
    //       // // }
    //       // return `vant/es/${name}`;
    //     }
    //     // style: true
    //   },
    //   'vant'
    // ]
    // [
    //   '@babel/plugin-proposal-decorators',
    //   {
    //     legacy: true
    //   }
    // ],
    // '@babel/plugin-transform-object-assign',
    // '@babel/plugin-proposal-optional-chaining'
  ]
};
