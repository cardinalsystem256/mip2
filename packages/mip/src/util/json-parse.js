/**
 * object string parser like JSON5
 * Refer to https://github.com/douglascrockford/JSON-js/blob/9139a9f6729f3c1623ca3ff5ccd58dec1523acab/json2.js
 *
 * @param {String} jsonStr Object string
 */

/* eslint-disable no-eval */
export default function (jsonStr) {
  jsonStr = jsonStr
    .replace(/(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g, item => item.replace(/[/*]/g, s => '\\' + s))
    .replace(/\/\/.*\n?/g, '')
    .replace(/\/\*.*\*\//g, '')

  let rxone = /^[\],:{}\s]*$/
  let rxtwo = /\\(?:["'\\/bfnrt]|u[0-9a-fA-F]{4})/g
  let rxthree = /"[^"\n\r]*"|'[^'\n\r]*'|[+-]?(Infinity|NaN)|([\u2e80-\u9fff]+|[_\w$][_\w\d$]*)\s*:|true|false|null|[+-]?\.?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?([xX][0-9a-fA-F]{1,2})?/g
  let rxfour = /(?:^|:|,)(?:\s*\[)+/g
  let validate = jsonStr
    .replace(rxtwo, '@')
    .replace(rxthree, item => (']' + (/:$/.test(item) ? ':' : '')))
    .replace(rxfour, '')

  if (rxone.test(validate)) {
    try {
      /* eslint-disable */
      // @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
      // 等价于在全局作用域调用，不影响uglify压缩变量名
      let geval = eval
      return geval('(' + jsonStr + ')')
      /* eslint-enable */
    } catch (e) { throw e }
  }
  throw new Error(jsonStr + ' Content should be a valid JSON string!')
}
