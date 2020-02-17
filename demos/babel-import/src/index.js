import add from './math';
import './index.css';
// import { Button, Icon } from 'agama';
import agama from 'agama';

function fetchAsync() {
  import('./async').then(function(m) {
    console.log(m.default);
  });
}

document.querySelector('#btn1').onclick = fetchAsync;

console.log(add(1, 2));

// console.log(Button);
