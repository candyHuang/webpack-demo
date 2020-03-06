/**
 * 统计上报
 */
import { utils, ce, bridge } from '@migu/sdk-core';
import loadScript from '../load-script';
import getDelegator from '../get-delegator';

const VIDEO_TIMES_MAP = {};

function getAttrElement(e, attr) {
  let rs = null;
  const pathArr = e.path || [];
  for (let index = 0; index < pathArr.length; index++) {
    const element = pathArr[index];
    if (!element.tagName || element.tagName.toLocaleUpperCase() === 'BODY') {
      break;
    }
    const signCode = element.getAttribute(attr);
    if (signCode) {
      rs = signCode;
      break;
    }
  }
  return rs;
}

// 点击区域统计
function delegateClick() {
  if (delegateClick.init) return;
  getDelegator().on(
    'click',
    '[vms-c]',
    event => {
      const vms = getAttrElement(event, 'vms-c');
      if (vms) {
        // 简单模式-尝试发送
        utils.vms.log('click', vms);
      }
    },
    true
  );
  // 分省 Webtrends
  getDelegator().on('click', '[wtevent]', event => {
    const Webtrends = window.Webtrends;
    if (Webtrends) {
      const signCode = getAttrElement(event, 'wtevent');
      if (signCode) {
        // 简单模式-尝试发送
        Webtrends.multiTrack({
          argsa: ['WT.si_n', signCode, 'WT.si_x', '99'],
        });
      }
    }
  });
  delegateClick.init = true;
}

// 播放时长统计
function delegateVideo() {
  if (document && !delegateVideo.init) {
    document.addEventListener('timeupdate', _videoDataReport, true);
    delegateVideo.init = true;
  }
}

function _videoDataReport(event) {
  const targetEle = event.target;
  if (targetEle.tagName && targetEle.tagName.toLowerCase() === 'video') {
    const src = targetEle.src;
    const time = Math.round(targetEle.currentTime);
    let data = VIDEO_TIMES_MAP[src];

    if (!data) {
      data = VIDEO_TIMES_MAP[src] = {
        start: new Date().valueOf(),
        time: 0,
        end: 0,
      };
    }
    if (time > 0 && time % 30 === 0 && data.time !== time) {
      let end = new Date().valueOf();
      VIDEO_TIMES_MAP[src].time = time;
      VIDEO_TIMES_MAP[src].end = end;
      utils.vms.logVideo(src, data.start, end);
    }
  }
}

export default {
  // 页面 pv uv pageId
  initPageId(pageId) {
    utils.vms.init({
      pageid: pageId,
    });
  },
  initAnalysis(analysis) {
    // 移动插码
    if (analysis.cmcc) {
      const province = analysis.province || 'mg';
      try {
        if (province !== 'mg') {
          // 分省的依赖 jquery
          loadScript(`/app/v3/public/js/webtrends/jquery.min.js`);
        }
        loadScript(
          `/app/v3/public/js/webtrends/${province}_sdc_load.js?v=20191204`
        );
      } catch (error) {
        console.log('mg_sdc_load load error');
      }
    }
    // 一级渠道
    if (analysis.firstChannel) {
      try {
        loadScript(`/app/v3/public/js/webtrends/jzyy_sdc_load.js`, function() {
          const provId = utils.lang.getQueryString('p');
          if (provId) {
            // 集团插码
            const wtLib = window._tag;
            if (wtLib) {
              // 号码
              ce.get('/pac/encryption/msisdn-encryption').then(function(res) {
                if (res && res.code === '000000' && res.data) {
                  wtLib.setMobile(res.data);
                }
              });
            }
          }
        });
      } catch (error) {
        console.log('jt_sdc_load load error');
      }
    }
    // 点击统计
    delegateClick();
    // 视频统计
    delegateVideo();
  },
  async bindAmberEvent() {
    let phoneNumber = '';
    window.setTimeout(async () => {
      //上报登录
      let res = await ce.get('/pac/encryption/msisdn-encryption');
      if (!res || res.code != '000000' || !res.data) return;
      phoneNumber = res.data;
      window._amberTrack &&
        window._amberTrack('user_login', [
          {
            EK: 'account',
            EV: '1',
          },
          {
            EK: 'account_type',
            EV: '1',
          },
          {
            EK: 'phone_number',
            EV: phoneNumber,
          },
        ]);
    }, 3000);
    //绑定业务上报
    bridge.on('action.payProduct:complete', async event => {
      var par = event.parameter;
      var an = event.answer;
      if (!an || an.success || !window._amberTrack) return;
      console.log('event', an, event);
      var EID = an.bizType || '';
      if (EID == 'set_crbt' || EID == 'set_vrbt') {
        EID = 'ringback_setup';
      }
      var sourceType = '';
      if (EID.indexOf('crbt') > -1) {
        sourceType = '01';
      }
      if (EID.indexOf('vrbt') > -1) {
        sourceType = '02';
      }
      // alert(JSON.stringify(par.vo));
      var data = [
        {
          EK: 'account_type',
          EV: '1',
        },
        {
          EK: 'phone_number',
          EV: phoneNumber,
        },
        {
          EK: 'source_id',
          EV: par.vo && par.vo.id,
        },
        {
          EK: 'source_type',
          EV: sourceType,
        },
      ];
      window._amberTrack(EID, data);
      console.log('_amberTrack', data);
    });
  },
};
