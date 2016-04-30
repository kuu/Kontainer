export function isNegative(value, bitLength) {
  return !!(value & (1 << (bitLength - 1)));
}

export function convertToNegative(value, bitLength) {
  const mask = (1 << bitLength) - 1;
  return -((~value & mask) + 1);
}

export function throwException(message) {
  throw new Error(message);
}

export function getUTF8Length(string) {
  return string.split('').map(ch => {
    const charCode = ch.charCodeAt(0);
    if (charCode < 0x80) {
      return 1;
    } else if (charCode >= 0x80 && charCode < 0x800) {
      return 2;
    } else if (charCode >= 0x800 && charCode < 0x10000) {
      return 3;
    } else if (charCode >= 0x10000 && charCode < 0x200000) {
      return 4;
    } else if (charCode >= 0x200000 && charCode < 0x4000000) {
      return 5;
    } else if (charCode >= 0x4000000 && charCode < 0x80000000) {
      return 6;
    } else {
      return 0
    }
  }).reduce((a, b) => a + b);
}
