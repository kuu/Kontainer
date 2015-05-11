'use strict';

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

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

  var base = offset,
      num = 0;

  length = Math.min(length, 8);

  for (var i = length - 1; i >= 0; i--) {
    num |= buffer[base++] << 8 * i;
  }

  return [base - offset, num];
}

function readFixedNumber(buffer, offset) {
  var length = arguments[2] === undefined ? 4 : arguments[2];

  var base = offset,
      readBytesNum,
      left,
      right,
      half = Math.min(length / 2, 2);

  var _readNumber = readNumber(buffer, base, half);

  var _readNumber2 = _slicedToArray(_readNumber, 2);

  readBytesNum = _readNumber2[0];
  left = _readNumber2[1];

  base += readBytesNum;

  var _readNumber3 = readNumber(buffer, base, half);

  var _readNumber32 = _slicedToArray(_readNumber3, 2);

  readBytesNum = _readNumber32[0];
  right = _readNumber32[1];

  base += readBytesNum;

  right = right / (1 << half * 8);

  return [base - offset, left + right];
}

function readIso639Lang(buffer, offset) {
  var base = offset,
      readBytesNum,
      num,
      language = '';

  var _readNumber4 = readNumber(buffer, base, 2);

  var _readNumber42 = _slicedToArray(_readNumber4, 2);

  readBytesNum = _readNumber42[0];
  num = _readNumber42[1];

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