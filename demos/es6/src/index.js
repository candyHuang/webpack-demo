import add from './math';

console.log(add(1, 2));

const arrowFn = () => {
  console.log('arrow fn');
};

// const set = new Set();

// const isHas = [1, 2, 3].includes(2);

const p = new Promise((resolve, reject) => {
  resolve(100);
});

// class Point {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
//   getX() {
//     return this.x;
//   }
// }
