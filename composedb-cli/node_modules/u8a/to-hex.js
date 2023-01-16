module.exports = function (u8a) {
  var chars = []
  var l = u8a.length
  for (var i = 0; i < l; i++) {
    var bite = u8a[i]
    chars.push((bite >>> 4).toString(16))
    chars.push((bite & 0x0f).toString(16))
  }
  return chars.join('')
}
