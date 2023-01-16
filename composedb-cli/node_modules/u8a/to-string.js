// http://stackoverflow.com/a/12713326
var fromCharCode = String.fromCharCode
module.exports = function (u8a) {
  var chunk = 0x8000
  var c = []
  var l = u8a.length
  for (var i = 0; i < l; i += chunk) {
    c.push(fromCharCode.apply(null, u8a.subarray(i, i + chunk)))
  }
  return c.join('')
}
