export function isNegative(value, bitLength) {
  return !!(value & (1 << (bitLength - 1)));
}

export function convertToNegative(value, bitLength) {
  const mask = (1 << bitLength) - 1;
  return -((~value & mask) + 1);
}
