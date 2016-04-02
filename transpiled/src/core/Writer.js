'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function writeByte(byte, buffer, offset) {
  var mask = arguments.length <= 3 || arguments[3] === undefined ? 0xFF : arguments[3];
  var or = arguments[4];

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

  if (charCode < 0x80) {
    // 1 byte
    writeByte(charCode, buffer, base++);
  } else if (charCode >= 0x80 && charCode < 0x800) {
    // 2 bytes
    writeByte(0xC0 | charCode >> 6 & 0x1F, buffer, base++);
    writeByte(0x80 | charCode >> 0 & 0x3F, buffer, base++);
  } else if (charCode >= 0x800 && charCode < 0x10000) {
    // 3 bytes
    writeByte(0xE0 | charCode >> 12 & 0x0F, buffer, base++);
    writeByte(0x80 | charCode >> 6 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 0 & 0x3F, buffer, base++);
  } else if (charCode >= 0x10000 && charCode < 0x200000) {
    // 4 bytes
    writeByte(0xF0 | charCode >> 18 & 0x07, buffer, base++);
    writeByte(0x80 | charCode >> 12 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 6 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 0 & 0x3F, buffer, base++);
  } else if (charCode >= 0x200000 && charCode < 0x4000000) {
    // 5 bytes
    writeByte(0xF8 | charCode >> 24 & 0x03, buffer, base++);
    writeByte(0x80 | charCode >> 18 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 12 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 6 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 0 & 0x3F, buffer, base++);
  } else if (charCode >= 0x4000000 && charCode < 0x80000000) {
    // 6 bytes
    writeByte(0xFC | charCode >> 30 & 0x01, buffer, base++);
    writeByte(0x80 | charCode >> 24 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 18 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 12 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 6 & 0x3F, buffer, base++);
    writeByte(0x80 | charCode >> 0 & 0x3F, buffer, base++);
  } else {
    console.error('Writer.writeCharacter: Invalid char code - ' + charCode);
  }
  return base - offset;
}

function writeString(str, buffer, offset, length) {
  var lowerLimit = offset + (length || 0);
  var upperLimit = offset + (length || Infinity);
  var nullTerminationNeeded = length === void 0;

  var base = offset;

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
  var length = arguments.length <= 3 || arguments[3] === undefined ? 4 : arguments[3];

  var left = num / 4294967296;
  var right = num % 4294967296;

  var base = offset,
      byte = undefined,
      i = undefined;

  if (num >= 0 && length > 4) {
    for (i = length - 4 - 1; i >= 0; i--) {
      byte = left >> 8 * i & 0xFF;
      writeByte(byte, buffer, base++);
    }
    length = 4;
  }

  for (i = length - 1; i >= 0; i--) {
    byte = right >> 8 * i & 0xFF;
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
  var base = byteOffset;
  var start = bitOffset;
  var remainingBits = totalBitsToWrite;
  var len = undefined,
      mask = undefined,
      byte = undefined,
      oddBitsNum = 0;

  //console.log(`\twriteBits(num=${num} byteOffset=${byteOffset} bitOffset=${bitOffset} totalBitsToWrite=${totalBitsToWrite})`);

  while (remainingBits > 0) {
    len = Math.min(remainingBits, 8 - start);
    byte = num >>> Math.max(remainingBits - 8, 0) & 0xFF;
    mask = makeBitMask(start, len);
    //console.log(`\t\twriteByte(byte=${(byte << start) & 0xFF} base=${base} mask=${mask} or=${!!start}`);
    writeByte(byte << start & 0xFF, buffer, base, mask, !!start);
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
  var length = arguments.length <= 3 || arguments[3] === undefined ? 4 : arguments[3];

  var left = num > 0 ? Math.floor(num) : Math.ceil(num);
  var halfBitsNum = Math.min(length, 8) * 8 / 2;

  var base = offset;
  var right = parseFloat('0.' + String(num).split('.')[1]);
  var writtenBytesNum = 0,
      unreadBitsNum = 0;

  //console.log(`writeFixedNumber(${num} ${offset} ${length})`);

  var _writeBits = writeBits(left, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _writeBits2 = _slicedToArray(_writeBits, 2);

  writtenBytesNum = _writeBits2[0];
  unreadBitsNum = _writeBits2[1];

  base += writtenBytesNum;

  if (halfBitsNum === 28 && right >= 0.9999999) {
    // ugly
    right = 0xFFFFFFFF;
  } else if (halfBitsNum === 32 && right >= 0.999999) {
    // ugly
    right = 0xFFFFFFFF;
  } else {
    right = Math.round(right * Math.pow(2, halfBitsNum));
  }

  var _writeBits3 = writeBits(right, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);

  var _writeBits4 = _slicedToArray(_writeBits3, 2);

  writtenBytesNum = _writeBits4[0];
  unreadBitsNum = _writeBits4[1];

  base += writtenBytesNum;

  //console.log(`<<<< return ${base - offset};`);
  return base - offset;
}

function writeIso639Lang(language, buffer, offset) {
  var base = offset,
      charCode = undefined,
      num = 0;

  if (language.length !== 3) {
    console.error('Writer.writeIso639Lang: Invalid language code - ' + language);
    return 0;
  }

  for (var i = 0; i < 3; i++) {
    charCode = language.charCodeAt(i) - 0x60;
    if (charCode > 0x1F) {
      console.error('Writer.writeIso639Lang: Invalid character - ' + language[i]);
      return 0;
    }
    num <<= 5;
    num |= charCode;
  }

  base += writeNumber(num, buffer, base, 2);

  return base - offset;
}

exports.default = {
  writeString: writeString,
  writeNumber: writeNumber,
  writeFixedNumber: writeFixedNumber,
  writeIso639Lang: writeIso639Lang
};