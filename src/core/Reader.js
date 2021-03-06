import {isNegative, convertToNegative} from './Util';
import {BufferReadError} from './Error';

function ASSERT(buffer, offset, bytesToRead) {
  if ((buffer.length - offset) < bytesToRead) {
    throw new BufferReadError();
  }
}

function throwBufferReadException(pendingData) {
  throw new BufferReadError(pendingData);
}

function readCharacter(buffer, offset) {
  let base = offset;

  const firstByte = buffer[base++];

  const decodeMultiBytes = (numBytes) => {
    const firstByteMask = (1 << (8 - numBytes)) - 1;
    const trailingBytes = numBytes - 1;

    let multiByteChar = firstByte & firstByteMask;

    for (let i = 0; i < trailingBytes; i++) {
      multiByteChar <<= 6;
      multiByteChar |= (buffer[base++] & 0x3F);
    }
    return multiByteChar;
  };

  let charCode;

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
    console.error('Reader.readCharacter: Invalid char code - ' + firstByte);
    return [0, null];
  }
  return [base - offset, charCode ? String.fromCharCode(charCode) : null];
}

const MAX_URL_LENGTH = 2048;

function readString(buffer, offset, length) {
  ASSERT(buffer, offset, length);

  const limit = offset + (length || MAX_URL_LENGTH);

  let base = offset;
  let readBytesNum, ch, str = '';

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

function readNumber(buffer, offset, length=4, signed=false, safeLimit=true) {
  ASSERT(buffer, offset, length);

  let base = offset, left = 0, right = 0, i, negative, result;

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

  if (safeLimit) {
    if (result < 0) {
      result = Math.max(result, Number.MIN_SAFE_INTEGER);
    } else {
      result = Math.min(result, Number.MAX_SAFE_INTEGER);
    }
  }

  return [base - offset, result];
}

function readBits(buffer, byteOffset, bitOffset, bitsToRead) {
  let base = byteOffset;

  const endOfBuffer = base + buffer.length;

  let start = bitOffset, num = 0;
  let remainingBits = bitsToRead;
  let len, byte, oddBitsNum = 0;

  //console.log(`\treadBits(byteOffset=${byteOffset} bitOffset=${bitOffset} bitsToRead=${bitsToRead})`);

  while (base < endOfBuffer && remainingBits) {
    byte = buffer[base];
    len = Math.min(remainingBits, 8 - start);
    num <<= len;
    oddBitsNum = Math.max(8 - start - len, 0);
    num |= ((byte >>> oddBitsNum) & ((1 << len) - 1));
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

function readFixedNumber(buffer, offset, length=4, signed=false) {
  ASSERT(buffer, offset, length);

  const halfBitsNum = Math.min(length, 8) * 8 / 2;

  let base = offset, readBytesNum, left, right;
  let unreadBitsNum = 0, result;

  //console.log(`readFixedNumber(offset=${offset} length=${length} signed=${signed})`);

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
    left = Math.max(left, Number.MIN_SAFE_INTEGER);
    result = left - right;
  } else {
    left = Math.min(left, Number.MAX_SAFE_INTEGER);
    result = left + right;
  }

  //console.log(`<<<< return [${base - offset} ${result}];`);

  return [base - offset, result];
}

function readIso639Lang(buffer, offset) {
  let base = offset, readBytesNum, num, language = '';

  [readBytesNum, num] = readNumber(buffer, base, 2);
  base += readBytesNum;

  for (let i = 3 - 1; i >= 0; i--) {
    language += String.fromCharCode(((num >>> (5 * i)) & 0x1F) + 0x60);
  }
  return [base - offset, language];
}

export default {
  readString,
  readNumber,
  readFixedNumber,
  readIso639Lang,
  ASSERT,
  throwBufferReadException
};
