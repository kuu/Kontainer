'use strict';

/*global describe, it, expect */
var Kontainer = require('../../../src/');

var DEC4 = 15 / 16,
    DEC8 = 255 / 256,
    DEC12 = 4095 / 4096,
    DEC16 = 65535 / 65536,
    DEC20 = 1048575 / 1048576,
    DEC24 = 16777215 / 16777216,
    DEC28 = 268435455 / 268435456,
    DEC32 = 4294967295 / 4294967296,
    testData = {
  int8Zero: {
    buf: [0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int16Zero: {
    buf: [0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int24Zero: {
    buf: [0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int32Zero: {
    buf: [0, 0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int40Zero: {
    buf: [0, 0, 0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int48Zero: {
    buf: [0, 0, 0, 0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int56Zero: {
    buf: [0, 0, 0, 0, 0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int64Zero: {
    buf: [0, 0, 0, 0, 0, 0, 0, 0],
    val: { signedInt: 0, unsignedInt: 0, signedDecimal: 0, unsignedDecimal: 0 }
  },
  int8X: {
    buf: [255],
    val: { signedInt: -1, unsignedInt: 255, signedDecimal: -1 - DEC4, unsignedDecimal: 15 + DEC4 }
  },
  int16X: {
    buf: [255, 255],
    val: { signedInt: -1, unsignedInt: 65535, signedDecimal: -1 - DEC8, unsignedDecimal: 255 + DEC8 }
  },
  int24X: {
    buf: [255, 255, 255],
    val: { signedInt: -1, unsignedInt: 16777215, signedDecimal: -1 - DEC12, unsignedDecimal: 4095 + DEC12 }
  },
  int32X: {
    buf: [255, 255, 255, 255],
    val: { signedInt: -1, unsignedInt: 4294967295, signedDecimal: -1 - DEC16, unsignedDecimal: 65535 + DEC16 }
  },
  int40X: {
    buf: [255, 255, 255, 255, 255],
    val: { signedInt: -1, unsignedInt: 1099511627775, signedDecimal: -1 - DEC20, unsignedDecimal: 1048575 + DEC20 }
  },
  int48X: {
    buf: [255, 255, 255, 255, 255, 255],
    val: { signedInt: -1, unsignedInt: 281474976710655, signedDecimal: -1 - DEC24, unsignedDecimal: 16777215 + DEC24 }
  },
  int56X: {
    buf: [31, 255, 255, 255, 255, 255, 255],
    buf2: [255, 255, 255, 255, 255, 255, 255],
    val: { signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, signedDecimal: -1 - DEC28, unsignedDecimal: 268435455.9999999 }
  },
  int64X: {
    buf: [0, 31, 255, 255, 255, 255, 255, 255],
    buf2: [255, 255, 255, 255, 255, 255, 255, 255],
    val: { signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, signedDecimal: -1 - DEC32, unsignedDecimal: 4294967295.999999 }
  },
  int32One: {
    buf: [0, 1, 0, 0],
    val: { signedInt: 65536, unsignedInt: 65536, signedDecimal: 1, unsignedDecimal: 1 }
  }
};

describe('Writer', function () {
  var Writer = Kontainer.Writer;

  it('reads numbers', function () {
    Object.keys(testData).forEach(function (key) {
      var entry = testData[key],
          inputValues = entry.val,
          expectedValue = entry.buf,
          len = expectedValue.length,
          buffer,
          writtenBytesNum;

      //console.log(`[${key}]----`);

      if (global && global.Buffer) {
        buffer = new Buffer(len);
      } else {
        buffer = new Uint8Array(len);
      }
      writtenBytesNum = Writer.writeNumber(inputValues.unsignedInt, buffer, 0, len);
      expect(writtenBytesNum).toBe(len);
      for (var i = 0, il = buffer.length; i < il; i++) {
        expect(buffer[i]).toBe(expectedValue[i]);
        //console.log(`\tUINT: expected=${expectedValue[i]} actual=${buffer[i]}`);
      }

      if (key === 'int56X' || key === 'int64X') {
        expectedValue = entry.buf2;
      }

      writtenBytesNum = Writer.writeFixedNumber(inputValues.unsignedDecimal, buffer, 0, len);
      expect(writtenBytesNum).toBe(len);
      for (var i = 0, il = buffer.length; i < il; i++) {
        expect(buffer[i]).toBe(expectedValue[i]);
        //console.log(`\tUDEC: expected=${expectedValue[i]} actual=${buffer[i]}`);
      }

      writtenBytesNum = Writer.writeNumber(inputValues.signedInt, buffer, 0, len);
      expect(writtenBytesNum).toBe(len);
      for (var i = 0, il = buffer.length; i < il; i++) {
        expect(buffer[i]).toBe(expectedValue[i]);
        //console.log(`\tINT: expected=${expectedValue[i]} actual=${buffer[i]}`);
      }

      writtenBytesNum = Writer.writeFixedNumber(inputValues.signedDecimal, buffer, 0, len);
      expect(writtenBytesNum).toBe(len);
      for (var i = 0, il = buffer.length; i < il; i++) {
        expect(buffer[i]).toBe(expectedValue[i]);
        //console.log(`\tDEC: expected=${expectedValue[i]} actual=${buffer[i]}`);
      }
    });
  });
});