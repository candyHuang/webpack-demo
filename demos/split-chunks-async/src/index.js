import add from './math';

export function fetchA() {
  import('./a').then(function(A) {
    console.log(A);
  });
}

console.log(add(1, 2));
