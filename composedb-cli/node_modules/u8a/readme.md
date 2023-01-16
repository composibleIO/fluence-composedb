# u8a

A collection of functions for working with Uint8Array representations of strings.

[![Build status](https://travis-ci.org/michaelrhodes/u8a.svg?branch=master)](https://travis-ci.org/michaelrhodes/u8a)

## Install

```sh
$ npm install u8a
```

## Usage

```js
var u8a = require('u8a/from-string')
var str = require('u8a/to-string')
var hex = require('u8a/to-hex')

console.log(u8a('hello'))
// => [104, 101, 108, 108, 111]

console.log(str(u8a('hello')))
// => 'hello'

console.log(hex(u8a('hello world')))
// => '68656c6c6f'
```

### Page weight (all combined)

| compression   |    size |
| :------------ | ------: |
| u8a.js        | 1.51 kB |
| u8a.min.js    | 1.08 kB |
| u8a.min.js.gz |   525 B |


## License

Public domain. No warranty.
