var test = require('tape')
var u8a = require('./from-string')
var str = require('./to-string')
var hex = require('./to-hex')

test('it works', function (assert) {
  assert.deepEqual(u8a('hello'), new Uint8Array([104, 101, 108, 108, 111]))
  assert.equal(str(u8a('hello')), 'hello')
  assert.equal(hex(u8a('hello')), '68656c6c6f')
  assert.end()
})
