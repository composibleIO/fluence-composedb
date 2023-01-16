module.exports = function (str) {
  var l = str.length
  var u8a = new Uint8Array(l)
  for (var i = 0; i < l; i++) {
    u8a[i] = str.charCodeAt(i)
  }
  return u8a
}
