'use strict';

import util from './Util.js';

var isNegative = util.isNegative,
    convertToNegative = util.convertToNegative;

function readCharacter(buffer, offset) {
  var base = offset,
      firstByte = buffer[base++],
      charCode,
      decodeMultiBytes = (numBytes) => {
    var firstByteMask = (1 << (8 - numBytes)) - 1,
        trailingBytes = numBytes = 1,
        multiByteChar = firstByte & firstByteMask;

    for (var i = 0; i < trailingBytes; i++) {
      multiByteChar <<= 6;
      multiByteChar |= (buffer[base++] & 0x3F);
    }
    return multiByteChar;
  };

  if (!(firstByte & 0x80)) {
    // 1 byte
    charCode = firstByte;
  } else if ((firstByte >>> 5) === 0x06) {
    // 2 byte
    charCode = decodeMultiBytes(2);
  } else if ((firstByte >>> 4) === 0x0E) {
    // 3 byte
    charCode = decodeMultiBytes(3);
  } else if ((firstByte >>> 3) === 0x1E) {
    // 4 byte
    charCode = decodeMultiBytes(4);
  } else if ((firstByte >>> 2) === 0x3E) {
    // 5 byte
    charCode = decodeMultiBytes(5);
  } else if ((firstByte >>> 1) === 0x7E) {
    // 6 byte
    charCode = decodeMultiBytes(6);
  } else {
    console.error('util.readCharacter: Invalid char code - ' + firstByte);
    return [0, null];
  }
  return [base - offset, charCode ? String.fromCharCode(charCode) : null];
}

const MAX_URL_LENGTH = 2048;

function readString(buffer, offset, length) {
  var base = offset,
      limit = offset + (length || MAX_URL_LENGTH),
      readBytesNum, ch, str = '';

  while (base < limit) {
    [readBytesNum, ch] = readCharacter(buffer, base);
    if (!ch) {
      // Null terminated string.
      base += readBytesNum;
      break;
    }
    str += ch;
    base += readBytesNum;
  }
  return [base - offset, str];
}

function readNumber(buffer, offset, length=4, signed=false) {
  var base = offset, left = 0, right = 0, i, negative, result;

  length = Math.min(length, 8);

  if (length > 4) {
    for (i = length - 4 - 1; i >= 0; i--) {
      left |= (buffer[base++] << (8 * i));
    }
    left >>>= 0;
    negative = isNegative(left, (length - 4) * 8);
    left *= 4294967296;
    length = 4;
  }

  for (i = length - 1; i >= 0; i--) {
    right |= (buffer[base++] << (8 * i));
  }
  right >>>= 0;

  result = left + right;

  if (signed) {
    if (negative === void 0) {
      negative = isNegative(result, length * 8);
    }

    if (negative) {
      result = convertToNegative(result, length * 8);
    }
  }

  if (result < 0) {
    result = Math.max(result, -Number.MAX_SAFE_INTEGER);
  } else {
    result = Math.min(result, Number.MAX_SAFE_INTEGER);
  }

  return [base - offset, result];
}

function makeBitMask(start, len) {
  var mask = 0;
  for (var i = 8 - start - 1, il = 8 - start - len; i >= il; i--) {
    mask |= (1 << i);
  }
  return mask;
}

function readBits(buffer, byteOffset, bitOffset, bitsToRead) {
  var base = byteOffset,
      endOfBuffer = base + buffer.length,
      start = bitOffset, num = 0,
      remainingBits = bitsToRead,
      len, mask, byte, oddBitsNum = 0;

  console.log(`\treadBits(byteOffset=${byteOffset} bitOffset=${bitOffset} bitsToRead=${bitsToRead})`);

  while (base < endOfBuffer && remainingBits) {
    len = Math.min(remainingBits, 8 - start);
    byte = buffer[base];
    mask = makeBitMask(start, len);
    num <<= Math.min(8, len);
    num |= ((byte & mask) & 0xFF);
    remainingBits -= len;
    oddBitsNum = Math.max(8 - start - len, 0);
    if (oddBitsNum) {
      break;
    }
    base++;
    start = 0;
  }
  num >>>= 0;
  console.log(`\t<<<< return [${base - byteOffset} ${num} ${oddBitsNum}];`);
  return [base - byteOffset, num, oddBitsNum];
}

function readFixedNumber(buffer, offset, length=4, signed=false) {
  var base = offset, readBytesNum, left, right,
      halfBitsNum = Math.min(length, 8) * 8 / 2,
      unreadBitsNum = 0, result;

  console.log(`readFixedNumber(offset=${offset} length=${length} signed=${signed})`);

  [readBytesNum, left, unreadBitsNum] = readBits(buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);
  base += readBytesNum;

  if (signed) {
    if (isNegative(left, halfBitsNum)) {
      left = convertToNegative(left, halfBitsNum);
    }
  }

  [readBytesNum, right, unreadBitsNum] = readBits(buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);
  base += readBytesNum;

  right /= (halfBitsNum === 32 ? 4294967296 : (1 << halfBitsNum));

  if (left < 0) {
    left = Math.max(left, -Number.MAX_SAFE_INTEGER);
    result = left - right;
  } else {
    left = Math.min(left, Number.MAX_SAFE_INTEGER);
    result = left + right;
  }

  console.log(`<<<< return [${base - offset} ${result}];`);

  return [base - offset, result];
}

/*
function readFixedNumber(buffer, offset, length=4) {
  var base = offset, readBytesNum, left, right,
      half = Math.min(length / 2, 2);

  [readBytesNum, left] = readNumber(buffer, base, half);
  base += readBytesNum;

  [readBytesNum, right] = readNumber(buffer, base, half);
  base += readBytesNum;

  right = right / (1 << (half * 8));

  return [base - offset, left + right];
}
*/

function readIso639Lang(buffer, offset) {
  var base = offset, readBytesNum, num, language = '';

  [readBytesNum, num] = readNumber(buffer, base, 2);
  base += readBytesNum;

  for (var i = 3 - 1; i >= 0; i--) {
    language += String.fromCharCode(((num >>> (5 * i)) & 0x1F) + 0x60);
  }
  return [base - offset, language];
}

module.exports = {
  readString: readString,
  readNumber: readNumber,
  readFixedNumber: readFixedNumber,
  readIso639Lang: readIso639Lang
};
