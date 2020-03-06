import { ce } from 'migu-sdk';
import loadScript from './load-script';
import { MIGU_LOGO, WX_JS_URL, WX_TICKET_URL } from '../const';

// 朋友圈  朋友 qq ... 不用onMenuxxxx 因为动态赋值会变化
const EVENTS = [
  'MenuShareAppMessage',
  'MenuShareTimeline',
  'MenuShareQQ',
  'MenuShareQZone',
  'MenuShareWeibo',
];
let isReady = false;
let readyPool = [];

let WX_TICKET = WX_TICKET_URL;
if (window.MIGU_C && window.MIGU_C.WX_TICKET_URL) {
  WX_TICKET = window.MIGU_C.WX_TICKET_URL;
}
/**
 * 配置参数
 */
function wxConfig(appId, timestamp, nonceStr, signature) {
  if (typeof wx !== 'undefined') {
    /* eslint-disable no-undef */
    wx.config({
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: EVENTS.map(el => `on${el}`),
    });
  }
}

/**
 * 触发
 */
function invokeReady() {
  isReady = true;
  readyPool.forEach(fn => {
    fn();
  });
  readyPool = [];
}

/**
 * 初始化
 */
function init() {
  const url = window.location.href;
  const params = { url };
  loadScript(WX_JS_URL, () => {
    ce.get(WX_TICKET, params).then(function(res) {
      if (res.code === '000000') {
        const data = res.data;
        wxConfig(data.appId, data.timestamp, data.noncestr, data.signature);
        wx.ready(invokeReady);
      } else {
        console.log('微信注册失败');
      }
    });
  });
}

const wxSDK = {
  ready(fn) {
    if (typeof fn !== 'function') {
      return;
    }
    if (isReady) {
      fn();
    } else {
      readyPool.push(fn);
      if (readyPool.length === 1) {
        init();
      }
    }
  },
  /**
   * 设置分享设置
   */
  setShare(config) {
    const shareCfg = {
      title: config.title || document.title, // 分享标题
      desc: config.desc || '咪咕音乐', // 分享描述
      link: config.link || window.location.href, // 分享链接
      imgUrl: config.imgUrl || MIGU_LOGO, // 分享图标
      type: config.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: config.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
      success: config.success,
      cancel: config.cancel,
    };

    const postfix = ' - 咪咕音乐';
    const timelineConf = Object.assign({}, shareCfg);

    if (config.timelineTitle) {
      timelineConf.title = config.timelineTitle;
    } else {
      timelineConf.title += ` - ${shareCfg.desc}`;
    }
    if (config.postfix !== false) {
      if (shareCfg.title.endsWith && !shareCfg.title.endsWith('咪咕音乐')) {
        shareCfg.title += postfix;
      }
      if (
        timelineConf.title.endsWith &&
        !timelineConf.title.endsWith('咪咕音乐')
      ) {
        timelineConf.title += postfix;
      }
    }

    // wx.onMenuShareTimeline(shareCfg); //朋友圈
    // wx.onMenuShareAppMessage(shareCfg); //朋友
    // wx.onMenuShareQQ(shareCfg); //qq
    // wx.onMenuShareWeibo(shareCfg); //微博
    // wx.onMenuShareQZone(shareCfg); //qq空间

    console.log('-------winixin--share-----', shareCfg, timelineConf);

    if (typeof wx !== 'undefined') {
      EVENTS.forEach(event => {
        if (event === 'MenuShareTimeline') {
          wx.onMenuShareTimeline(timelineConf);
        } else {
          wx[`on${event}`](shareCfg);
        }
      });
    }
  },
};

export default wxSDK;
