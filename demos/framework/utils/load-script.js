export default function loadScript(url, success) {
  let { head } = document;
  let node = document.createElement('script');
  node.type = 'text/javascript';
  node.async = false;
  node.src = url;

  function onreadystatechange() {
    if (node && (!node.readyState || /loaded|complete/.test(node.readyState))) {
      node.onload = null;
      node.onreadystatechange = null;
      // if (head && node.parentNode) head.removeChild(node);
      if (success) {
        success();
      }
      node = null;
      head = null;
    }
  }
  node.onload = onreadystatechange;
  node.onreadystatechange = onreadystatechange;
  node.onerror = function onerror(e) {
    console.log(`Error loading url: ${url}.${e}`);
  };
  head.appendChild(node);
}
