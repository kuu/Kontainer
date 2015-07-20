'use strict';

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

/*
import util from './Util.js';

var isNegative = util.isNegative,
    convertToNegative = util.convertToNegative;
*/

function writeByte(byte, buffer, offset, _x, or) {
  var mask = arguments[3] === undefined ? 255 : arguments[3];

  if (buffer) {
    if (or) {
      buffer[offset] |= byte & mask;
    } else {
      buffer[offset] = byte & mask;
    }
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
      byte,
      i,
      left = num / 4294967296,
      right = num % 4294967296;

  if (num >= 0 && length > 4) {
    for (i = length - 4 - 1; i >= 0; i--) {
      byte = left >> 8 * i & 255;
      writeByte(byte, buffer, base++);
    }
    length = 4;
  }

  for (i = length - 1; i >= 0; i--) {
    byte = right >> 8 * i & 255;
    writeByte(byte, buffer, base++);
  }

  return base - offset;
}

function makeBitMask(start, len) {
  var mask = 0;
  for (var i = start + len - 1; i >= start; i--) {
    mask |= 1 << i;
  }
  return mask;
}

function writeBits(num, buffer, byteOffset, bitOffset, totalBitsToWrite) {
  var base = byteOffset,
      start = bitOffset,
      remainingBits = totalBitsToWrite,
      len,
      mask,
      byte,
      oddBitsNum = 0;

  //console.log(`\twriteBits(num=${num} byteOffset=${byteOffset} bitOffset=${bitOffset} totalBitsToWrite=${totalBitsToWrite})`);

  while (remainingBits > 0) {
    len = Math.min(remainingBits, 8 - start);
    byte = num >>> Math.max(remainingBits - 8, 0) & 255;
    mask = makeBitMask(start, len);
    //console.log(`\t\twriteByte(byte=${(byte << start) & 0xFF} base=${base} mask=${mask} or=${!!start}`);
    writeByte(byte << start & 255, buffer, base, mask, !!start);
    remainingBits -= len;
    oddBitsNum = Math.max(8 - start - len, 0);
    if (oddBitsNum) {
      break;
    }
    base++;
    start = 0;
  }

  //console.log(`\t<<<< return [${base - byteOffset} ${oddBitsNum}];`);
  return [base - byteOffset, oddBitsNum];
}

function writeFixedNumber(num, buffer, offset) {
  var length = arguments[3] === undefined ? 4 : arguments[3];

  var base = offset,
      left = num > 0 ? Math.floor(num) : Math.ceil(num),
      right = parseFloat('0.' + String(num).split('.')[1]),
      halfBitsNum = Math.min(length, 8) * 8 / 2,
      writtenBytesNum = 0,
      unreadBitsNum = 0;

  //console.log(`writeFixedNumber(${num} ${offset} ${length})`);

  var _writeBits = writeBits(left, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _writeBits2 = _slicedToArray(_writeBits, 2);

  writtenBytesNum = _writeBits2[0];
  unreadBitsNum = _writeBits2[1];

  base += writtenBytesNum;

  if (halfBitsNum === 28 && right >= 0.9999999) {
    // ugly
    right = 4294967295;
  } else if (halfBitsNum === 32 && right >= 0.999999) {
    // ugly
    right = 4294967295;
  } else {
    right = Math.round(right * Math.pow(2, halfBitsNum));
  }

  var _writeBits3 = writeBits(right, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _writeBits32 = _slicedToArray(_writeBits3, 2);

  writtenBytesNum = _writeBits32[0];
  unreadBitsNum = _writeBits32[1];

  base += writtenBytesNum;

  //console.log(`<<<< return ${base - offset};`);
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