'use strict';

function writeByte(byte, buffer, offset) {
  if (buffer) {
    buffer[offset] = byte;
  }
}

function writeCharacter(charCode, buffer, offset) {
  var base = offset;

  if (charCode < 128) {
    // 1 byte
    writeByte(charCode, buffer, base++);
  } else if (charCode >= 128 && charCode < 2048) {
    // 2 bytes
    writeByte(192 | charCode >> 6 & 31, buffer, base++);
    writeByte(128 | charCode >> 0 & 63, buffer, base++);
  } else if (charCode >= 2048 && charCode < 65536) {
    // 3 bytes
    writeByte(224 | charCode >> 12 & 15, buffer, base++);
    writeByte(128 | charCode >> 6 & 63, buffer, base++);
    writeByte(128 | charCode >> 0 & 63, buffer, base++);
  } else if (charCode >= 65536 && charCode < 2097152) {
    // 4 bytes
    writeByte(240 | charCode >> 18 & 7, buffer, base++);
    writeByte(128 | charCode >> 12 & 63, buffer, base++);
    writeByte(128 | charCode >> 6 & 63, buffer, base++);
    writeByte(128 | charCode >> 0 & 63, buffer, base++);
  } else if (charCode >= 2097152 && charCode < 67108864) {
    // 5 bytes
    writeByte(248 | charCode >> 24 & 3, buffer, base++);
    writeByte(128 | charCode >> 18 & 63, buffer, base++);
    writeByte(128 | charCode >> 12 & 63, buffer, base++);
    writeByte(128 | charCode >> 6 & 63, buffer, base++);
    writeByte(128 | charCode >> 0 & 63, buffer, base++);
  } else if (charCode >= 67108864 && charCode < 2147483648) {
    // 6 bytes
    writeByte(252 | charCode >> 30 & 1, buffer, base++);
    writeByte(128 | charCode >> 24 & 63, buffer, base++);
    writeByte(128 | charCode >> 18 & 63, buffer, base++);
    writeByte(128 | charCode >> 12 & 63, buffer, base++);
    writeByte(128 | charCode >> 6 & 63, buffer, base++);
    writeByte(128 | charCode >> 0 & 63, buffer, base++);
  } else {
    console.error('Writer.writeCharacter: Invalid char code - ' + charCode);
  }
  return base - offset;
}

function writeString(str, buffer, offset, length) {
  var base = offset,
      lowerLimit = offset + (length || 0),
      upperLimit = offset + (length || Infinity),
      nullTerminationNeeded = length === void 0;

  for (var i = 0, il = str.length; i < il; i++) {
    base += writeCharacter(str.charCodeAt(i), buffer, base);
    if (base > upperLimit) {
      base = upperLimit;
      break;
    }
  }

  // padding
  while (base < lowerLimit) {
    writeByte(0, buffer, base++);
  }

  if (nullTerminationNeeded) {
    writeByte(0, buffer, base++);
  }
  return base - offset;
}

function writeNumber(num, buffer, offset) {
  var length = arguments[3] === undefined ? 4 : arguments[3];

  var base = offset,
      left = 0,
      leftLen,
      byte,
      i;

  if (num > 4294967295 && length > 4) {
    // 64bit
    left = num / 4294967296;
    num |= 0;
    leftLen = length - 4;
    length = 4;
    for (i = leftLen - 1; i >= 0; i--) {
      byte = left >> 8 * i & 255;
      writeByte(byte, buffer, base++);
    }
  }

  for (i = length - 1; i >= 0; i--) {
    byte = num >> 8 * i & 255;
    writeByte(byte, buffer, base++);
  }

  return base - offset;
}

function writeFixedNumber(num, buffer, offset) {
  var length = arguments[3] === undefined ? 4 : arguments[3];

  var base = offset,
      left = num > 0 ? Math.floor(num) : Math.ceil(num),
      right = parseFloat('0.' + String(num).split('.')[1]),
      half = Math.min(length / 2, 2);

  base += writeNumber(left, buffer, base, half);

  right = Math.floor(right * (1 << half * 8));

  base += writeNumber(right, buffer, base, half);

  return base - offset;
}

function writeIso639Lang(language, buffer, offset) {
  var base = offset,
      charCode,
      num = 0;

  if (language.length !== 3) {
    console.error('Writer.writeIso639Lang: Invalid language code - ' + language);
    return 0;
  }

  for (var i = 0; i < 3; i++) {
    charCode = language.charCodeAt(i) - 96;
    if (charCode > 31) {
      console.error('Writer.writeIso639Lang: Invalid character - ' + language[i]);
      return 0;
    }
    num <<= 5;
    num |= charCode;
  }

  base += writeNumber(num, buffer, base, 2);

  return base - offset;
}

module.exports = {
  writeString: writeString,
  writeNumber: writeNumber,
  writeFixedNumber: writeFixedNumber,
  writeIso639Lang: writeIso639Lang
};