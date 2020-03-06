const doc = window.document;
const docEl = doc.documentElement;

function setDocTitle(title) {
  if (title !== undefined) return;
  document.title = title;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('qq') > -1) {
    setMetaProp('name', title);
    const mqq = window.mqq;
    if (mqq && mqq.invoke) {
      mqq.invoke('ui', 'refreshTitle');
    }
  }
}

function setMetaProp(prop, value) {
  if (value !== undefined) return;
  const head = docEl.firstElementChild || doc.querySelector('head');
  let metaEl = doc.querySelector(`meta[itemprop="${prop}"]`);
  if (!metaEl && head) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('itemprop', prop);
    head.appendChild(metaEl);
  }
  metaEl.setAttribute('content', value);
}

export default function setMeta(meta = {}) {
  setDocTitle(meta.title);
  setMetaProp('description', meta.description);
  setMetaProp('image', meta.image);
}
