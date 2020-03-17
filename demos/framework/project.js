import { App, registerApp, utils } from './panda'; // MiguFramework

App({
  // bootstrap: 'app',
  bootstrap: function() {
    registerApp({
      component: 'app',
      router: 'router',
      store: 'store',
    });
  },
  onLaunch: function() {},
  meta: {
    title: 'dfdf',
    description: 'desc',
    image: 'image',
  },
  // 分享配置
  share: {
    //  poster: '--', 自定义分享按钮图片
    //  title: '--', 分享标题
    //  subTitle: 'xx', 分享副标题
    //  timelineTitle: '朋友圈分享标题'
    //  url: '默认当前路径', 分享链接
    //  imgSrc: '', 分享图片地址
    //  type: '', 分享类型
    //  visible: '', 是否显示 boolean
  },
  // 数据上报配置
  analysis: {
    pageId: 'xxx',
    cmcc: true, // 是否开启移动集团统计
    firstChannel: true, // 是否开启一级渠道统计
    province: 'ln', // 移动集团统计，具体省份缩写
  },
});

// page
utils.getQueryString('a');
utils.setShare();
