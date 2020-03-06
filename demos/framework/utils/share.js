import wxSDK from './wx-sdk';

export function setShare(config = {}) {
  const { title, subTitle, imgSrc, url, timelineTitle, postfix } = config;

  wxSDK.ready(() => {
    wxSDK.setShare({
      title,
      timelineTitle,
      desc: subTitle,
      imgUrl: imgSrc,
      link: url,
      postfix: postfix,
    });
  });
}
