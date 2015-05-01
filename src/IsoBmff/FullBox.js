'use strict';

var Box = require('./Box');

function FullBox(boxType, v, f) {
  Box(boxType);
  this.version = v; // unsigned int(8)
  this.flag = f; // bit(24)
}

module.exports = FullBox;
