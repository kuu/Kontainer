"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNegative = isNegative;
exports.convertToNegative = convertToNegative;
function isNegative(value, bitLength) {
  return !!(value & 1 << bitLength - 1);
}

function convertToNegative(value, bitLength) {
  var mask = (1 << bitLength) - 1;
  return -((~value & mask) + 1);
}