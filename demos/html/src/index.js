import add from './math';
import './index.css';

function fetchAsync() {
  import('./async').then(function(m) {
    console.log(m.default);
  });
}

document.querySelector('#btn1').onclick = fetchAsync;

console.log(add(1, 2));
