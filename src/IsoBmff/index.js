'use strict';

var MediaFormat = require('../MediaFormat'),
    Box = require('./Box'),
    FullBox = require('./FullBox');

var clazz = {
  ftyp: require('./FileTypeBox')
};

function createElement(type, props, children) {
  console.log('IsoBmff.createElement(', type, props, children, ')');
  if (typeof type === 'string') {
    type = clazz[type];
    if (!type) {
      console.error('IsoBmff.createElement: invalid type.');
      return null;
    }
    arguments[0] = type;
  } else if (!type || typeof type.prototype.serialize !== 'function') {
    console.error('IsoBmff.createElement: type should be a string or a class object.');
    return null;
  }

  return MediaFormat.createElement.apply(this, arguments);
}

module.exports = {
  Box: Box,
  FullBox: FullBox,
  createElement: createElement
};
