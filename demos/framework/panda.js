import analysisHelper from './utils/analysis';
import { registerApp } from './register';
import * as utils from './utils';

function App(config) {
  const { analysis, meta, bootstrap, onLaunch } = config;

  // 数据上报（amber）
  if (analysis) {
    analysisHelper.init(analysis);
  }
  // meta 信息
  if (meta) {
    utils.setMeta(meta);
  }
  // 分享
  if (share) {
    utils.setShare(share);
  }

  // 初始化根组件
  if (bootstrap) {
    if (typeof bootstrap === 'function') {
      bootstrap();
    } else {
      registerApp({
        component: bootstrap,
      });
    }
  }
  if (onLaunch) {
    onLaunch();
  }
}

export { App, registerApp, utils };
