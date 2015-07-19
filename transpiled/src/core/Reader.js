'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _UtilJs = require('./Util.js');

var _UtilJs2 = _interopRequireDefault(_UtilJs);

'use strict';

var isNegative = _UtilJs2['default'].isNegative,
    convertToNegative = _UtilJs2['default'].convertToNegative;

function readCharacter(buffer, offset) {
  var base = offset,
      firstByte = buffer[base++],
      charCode,
      decodeMultiBytes = function decodeMultiBytes(numBytes) {
    var firstByteMask = (1 << 8 - numBytes) - 1,
        trailingBytes = numBytes = 1,
        multiByteChar = firstByte & firstByteMask;

    for (var i = 0; i < trailingBytes; i++) {
      multiByteChar <<= 6;
      multiByteChar |= buffer[base++] & 63;
    }
    return multiByteChar;
  };

  if (!(firstByte & 128)) {
    // 1 byte
    charCode = firstByte;
  } else if (firstByte >>> 5 === 6) {
    // 2 byte
    charCode = decodeMultiBytes(2);
  } else if (firstByte >>> 4 === 14) {
    // 3 byte
    charCode = decodeMultiBytes(3);
  } else if (firstByte >>> 3 === 30) {
    // 4 byte
    charCode = decodeMultiBytes(4);
  } else if (firstByte >>> 2 === 62) {
    // 5 byte
    charCode = decodeMultiBytes(5);
  } else if (firstByte >>> 1 === 126) {
    // 6 byte
    charCode = decodeMultiBytes(6);
  } else {
    console.error('util.readCharacter: Invalid char code - ' + firstByte);
    return [0, null];
  }
  return [base - offset, charCode ? String.fromCharCode(charCode) : null];
}

var MAX_URL_LENGTH = 2048;

function readString(buffer, offset, length) {
  var base = offset,
      limit = offset + (length || MAX_URL_LENGTH),
      readBytesNum,
      ch,
      str = '';

  while (base < limit) {
    var _readCharacter = readCharacter(buffer, base);

    var _readCharacter2 = _slicedToArray(_readCharacter, 2);

    readBytesNum = _readCharacter2[0];
    ch = _readCharacter2[1];

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

function readNumber(buffer, offset) {
  var length = arguments[2] === undefined ? 4 : arguments[2];
  var signed = arguments[3] === undefined ? false : arguments[3];

  var base = offset,
      left = 0,
      right = 0,
      i,
      negative,
      result;

  length = Math.min(length, 8);

  if (length > 4) {
    for (i = length - 4 - 1; i >= 0; i--) {
      left |= buffer[base++] << 8 * i;
    }
    left >>>= 0;
    negative = isNegative(left, (length - 4) * 8);
    left *= 4294967296;
    length = 4;
  }

  for (i = length - 1; i >= 0; i--) {
    right |= buffer[base++] << 8 * i;
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
    result = Math.max(result, Number.MIN_SAFE_INTEGER);
  } else {
    result = Math.min(result, Number.MAX_SAFE_INTEGER);
  }

  return [base - offset, result];
}

function readBits(buffer, byteOffset, bitOffset, bitsToRead) {
  var base = byteOffset,
      endOfBuffer = base + buffer.length,
      start = bitOffset,
      num = 0,
      remainingBits = bitsToRead,
      len,
      byte,
      oddBitsNum = 0;

  //console.log(`\treadBits(byteOffset=${byteOffset} bitOffset=${bitOffset} bitsToRead=${bitsToRead})`);

  while (base < endOfBuffer && remainingBits) {
    byte = buffer[base];
    len = Math.min(remainingBits, 8 - start);
    num <<= len;
    oddBitsNum = Math.max(8 - start - len, 0);
    num |= byte >>> oddBitsNum & (1 << len) - 1;
    remainingBits -= len;
    if (oddBitsNum) {
      break;
    }
    base++;
    start = 0;
  }
  num >>>= 0;
  //console.log(`\t<<<< return [${base - byteOffset} ${num} ${oddBitsNum}];`);
  return [base - byteOffset, num, oddBitsNum];
}

function readFixedNumber(buffer, offset) {
  var length = arguments[2] === undefined ? 4 : arguments[2];
  var signed = arguments[3] === undefined ? false : arguments[3];

  var base = offset,
      readBytesNum,
      left,
      right,
      halfBitsNum = Math.min(length, 8) * 8 / 2,
      unreadBitsNum = 0,
      result;

  //console.log(`readFixedNumber(offset=${offset} length=${length} signed=${signed})`);

  var _readBits = readBits(buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _readBits2 = _slicedToArray(_readBits, 3);

  readBytesNum = _readBits2[0];
  left = _readBits2[1];
  unreadBitsNum = _readBits2[2];

  base += readBytesNum;

  if (signed) {
    if (isNegative(left, halfBitsNum)) {
      left = convertToNegative(left, halfBitsNum);
    }
  }

  var _readBits3 = readBits(buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _readBits32 = _slicedToArray(_readBits3, 3);

  readBytesNum = _readBits32[0];
  right = _readBits32[1];
  unreadBitsNum = _readBits32[2];

  base += readBytesNum;

  right /= halfBitsNum === 32 ? 4294967296 : 1 << halfBitsNum;

  if (left < 0) {
    left = Math.max(left, Number.MIN_SAFE_INTEGER);
    result = left - right;
  } else {
    left = Math.min(left, Number.MAX_SAFE_INTEGER);
    result = left + right;
  }

  //console.log(`<<<< return [${base - offset} ${result}];`);

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
  var base = offset,
      readBytesNum,
      num,
      language = '';

  var _readNumber = readNumber(buffer, base, 2);

  var _readNumber2 = _slicedToArray(_readNumber, 2);

  readBytesNum = _readNumber2[0];
  num = _readNumber2[1];

  base += readBytesNum;

  for (var i = 3 - 1; i >= 0; i--) {
    language += String.fromCharCode((num >>> 5 * i & 31) + 96);
  }
  return [base - offset, language];
}

module.exports = {
  readString: readString,
  readNumber: readNumber,
  readFixedNumber: readFixedNumber,
  readIso639Lang: readIso639Lang
};