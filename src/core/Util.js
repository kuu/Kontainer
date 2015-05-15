export default {
  isNegative: (value, bitLength) => !!(value & (1 << (bitLength - 1))),

  convertToNegative: (value, bitLength) => {
    var mask = (1 << bitLength) - 1;
    return -((~value & mask) + 1);
  }
};
