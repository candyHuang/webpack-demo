import Vue from 'vue';
import upperCamelCase from 'uppercamelcase';
import objectPath from 'object-path';
import A1 from './a1';

console.log('Vue in a.js', Vue);
upperCamelCase('foo-bar');
console.log('A1 in a.js', A1, objectPath);

export default {
  name: 'A'
};
