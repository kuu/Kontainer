function writeByte(byte, buffer, offset, mask=0xFF, or) {
  if (buffer) {
    if (or) {
      buffer[offset] |= (byte & mask);
    } else {
      buffer[offset] = byte & mask;
    }
  }
}

function writeCharacter(charCode, buffer, offset) {
  let base = offset;

  if (charCode < 0x80) {
    // 1 byte
    writeByte(charCode, buffer, base++);
  } else if (charCode >= 0x80 && charCode < 0x800) {
    // 2 bytes
    writeByte(0xC0 | ((charCode >> 6) & 0x1F), buffer, base++);
    writeByte(0x80 | ((charCode >> 0) & 0x3F), buffer, base++);
  } else if (charCode >= 0x800 && charCode < 0x10000) {
    // 3 bytes
    writeByte(0xE0 | ((charCode >> 12) & 0x0F), buffer, base++);
    writeByte(0x80 | ((charCode >> 6) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 0) & 0x3F), buffer, base++);
  } else if (charCode >= 0x10000 && charCode < 0x200000) {
    // 4 bytes
    writeByte(0xF0 | ((charCode >> 18) & 0x07), buffer, base++);
    writeByte(0x80 | ((charCode >> 12) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 6) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 0) & 0x3F), buffer, base++);
  } else if (charCode >= 0x200000 && charCode < 0x4000000) {
    // 5 bytes
    writeByte(0xF8 | ((charCode >> 24) & 0x03), buffer, base++);
    writeByte(0x80 | ((charCode >> 18) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 12) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 6) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 0) & 0x3F), buffer, base++);
  } else if (charCode >= 0x4000000 && charCode < 0x80000000) {
    // 6 bytes
    writeByte(0xFC | ((charCode >> 30) & 0x01), buffer, base++);
    writeByte(0x80 | ((charCode >> 24) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 18) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 12) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 6) & 0x3F), buffer, base++);
    writeByte(0x80 | ((charCode >> 0) & 0x3F), buffer, base++);
  } else {
    console.error('Writer.writeCharacter: Invalid char code - ' + charCode);
  }
  return base - offset;
}

function writeString(str, buffer, offset, length) {
  const lowerLimit = offset + (length || 0);
  const upperLimit = offset + (length || Infinity);
  const nullTerminationNeeded = (length === void 0);

  let base = offset;

  for (let i = 0, il = str.length; i < il; i++) {
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

function writeNumber(num, buffer, offset, length=4) {
  const left = num / 4294967296;
  const right = num % 4294967296;

  let base = offset, byte, i;

  if (num >= 0 && length > 4) {
    for (i = length - 4 - 1; i >= 0; i--) {
      byte = (left >> (8 * i)) & 0xFF;
      writeByte(byte, buffer, base++);
    }
    length = 4;
  }

  for (i = length - 1; i >= 0; i--) {
    byte = (right >> (8 * i)) & 0xFF;
    writeByte(byte, buffer, base++);
  }

  return base - offset;
}

function makeBitMask(start, len) {
  let mask = 0;

  for (let i = start + len - 1; i >= start; i--) {
    mask |= (1 << i);
  }
  return mask;
}

function writeBits(num, buffer, byteOffset, bitOffset, totalBitsToWrite) {
  let base = byteOffset;
  let start = bitOffset;
  let remainingBits = totalBitsToWrite;
  let len, mask, byte, oddBitsNum = 0;

  //console.log(`\twriteBits(num=${num} byteOffset=${byteOffset} bitOffset=${bitOffset} totalBitsToWrite=${totalBitsToWrite})`);

  while (remainingBits > 0) {
    len = Math.min(remainingBits, 8 - start);
    byte = (num >>> Math.max(remainingBits - 8, 0)) & 0xFF;
    mask = makeBitMask(start, len);
    //console.log(`\t\twriteByte(byte=${(byte << start) & 0xFF} base=${base} mask=${mask} or=${!!start}`);
    writeByte((byte << start) & 0xFF, buffer, base, mask, !!start);
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

function writeFixedNumber(num, buffer, offset, length=4) {
  const left = num > 0 ? Math.floor(num) : Math.ceil(num);
  const halfBitsNum = Math.min(length, 8) * 8 / 2;

  let base = offset;
  let right = parseFloat('0.' + String(num).split('.')[1]);
  let writtenBytesNum = 0, unreadBitsNum = 0;

  //console.log(`writeFixedNumber(${num} ${offset} ${length})`);

  [writtenBytesNum, unreadBitsNum] = writeBits(left, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);
  base += writtenBytesNum;

  if (halfBitsNum === 28 && right >= 0.9999999) { // ugly
    right = 0xFFFFFFFF;
  } else if (halfBitsNum === 32 && right >= 0.999999) { // ugly
    right = 0xFFFFFFFF;
  } else {
    right = Math.round(right * Math.pow(2, halfBitsNum));
  }

  [writtenBytesNum, unreadBitsNum] = writeBits(right, buffer, base, (8 - unreadBitsNum) % 8, halfBitsNum);
  base += writtenBytesNum;

  //console.log(`<<<< return ${base - offset};`);
  return base - offset;
}

function writeIso639Lang(language, buffer, offset) {
  let base = offset, charCode, num = 0;

  if (language.length !== 3) {
    console.error(`Writer.writeIso639Lang: Invalid language code - ${language}`);
    return 0;
  }

  for (let i = 0; i < 3; i++) {
    charCode = language.charCodeAt(i) - 0x60;
    if (charCode > 0x1F) {
      console.error(`Writer.writeIso639Lang: Invalid character - ${language[i]}`);
      return 0;
    }
    num <<= 5;
    num |= charCode;
  }

  base += writeNumber(num, buffer, base, 2);

  return base - offset;
}

export default {
  writeString,
  writeNumber,
  writeFixedNumber,
  writeIso639Lang
};
