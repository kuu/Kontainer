'use strict';

function writeByte(byte, buffer, offset) {
  if (buffer) {
    buffer[offset] = byte;
  }
}

function writeCharacter(charCode, buffer, offset) {
  var base = offset;

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
    console.error('util.writeCharacter: Invalid char code - ' + charCode);
  }
  return base - offset;
}

function writeString(str, buffer, offset, length) {
  var base = offset,
      lowerLimit = offset + (length || 0),
      upperLimit = offset + (length || Infinity);

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
  return base - offset;
}

function writeNumber(num, buffer, offset, length) {
  var base = offset, byte,
      lowerLimit = offset + (length || 0),
      upperLimit = offset + (length || Infinity);

  while ((byte = num & 0xff) && (base - offset <= upperLimit)) {
    writeByte(byte, buffer, base++);
    num >>>= 8;
  }

  // padding
  while (base < lowerLimit) {
    writeByte(0, buffer, base++);
  }
  return base - offset;
}

module.exports = {
  writeString: writeString,
  writeNumber: writeNumber
};
