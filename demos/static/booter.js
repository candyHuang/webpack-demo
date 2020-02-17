console.log('booter.js');

var booter = {
  config: function() {},
  start: function() {
    document.write(
      //   [
      //     '<script src="http://h5dev.migu.cn:8080/app/v2/zt/2018/gio-test/gio.jsp?sleep=5000&name=a"></script>',
      //     '<script src="http://h5dev.migu.cn:8080/app/v2/zt/2018/gio-test/gio.jsp?sleep=2000&name=b"></script>'
      //   ].join('')

      [
        '<script defer src="./a.js"></script>',
        '<script defer src="./b.js"></script>',
        '<script defer src="http://h5dev.migu.cn:8080/app/v3/public/pkg/migu/migu_sdk.ab70f297.js"></script>'
      ].join('')
    );
  }
};
