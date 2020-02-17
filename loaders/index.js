/**
 * loader Function
 * @param {String} content 文件内容
 */

// module.exports = function(content) {
//   return '{};' + content;
// };

module.exports = async function(content) {
  function timeout(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('{};' + content);
      }, delay);
    });
  }
  const data = await timeout(1000);
  return data;
};
