"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  isNegative: function isNegative(value, bitLength) {
    return !!(value & 1 << bitLength - 1);
  },

  convertToNegative: function convertToNegative(value, bitLength) {
    var mask = (1 << bitLength) - 1;
    return -((~value & mask) + 1);
  }
};
module.exports = exports["default"];