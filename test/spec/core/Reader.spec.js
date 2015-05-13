/*global describe, it, expect */
describe('Reader', function () {
  var Kontainer = require('../../../src/');

  var Reader = Kontainer.Reader,
      DEC4 = 15 / 16,
      DEC8 = 255 / 256,
      DEC12 = 4095 / 4096,
      DEC16 = 65535 / 65536,
      DEC20 = 1048575 / 1048576,
      DEC24 = 16777215 / 16777216,
      DEC28 = 268435455 / 268435456,
      DEC32 = 4294967295 / 4294967296,
      buffer = {
      int8Zero: {
        buf: [0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int16Zero: {
        buf: [0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int24Zero: {
        buf: [0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int32Zero: {
        buf: [0, 0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int40Zero: {
        buf: [0, 0, 0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int48Zero: {
        buf: [0, 0, 0, 0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int56Zero: {
        buf: [0, 0, 0, 0, 0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int64Zero: {
        buf: [0, 0, 0, 0, 0, 0, 0, 0],
        val: {signedInt: 0, unsignedInt: 0, decimal: 0, unsignedDecimal: 0}
      },
      int8X: {
        buf: [255],
        val: {signedInt: -1, unsignedInt: 255, decimal: -8 - DEC4, unsignedDecimal: 15 + DEC4}
      },
      int16X: {
        buf: [255, 255],
        val: {signedInt: -1, unsignedInt: 65535, decimal: -128 - DEC8, unsignedDecimal: 255 + DEC8}
      },
      int24X: {
        buf: [255, 255, 255],
        val: {signedInt: -1, unsignedInt: 16777215, decimal: -2048 - DEC12, unsignedDecimal: 4095 + DEC12}
      },
      int32X: {
        buf: [255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 4294967295, decimal: -32768 - DEC16, unsignedDecimal: 65535 + DEC16}
      },
      int40X: {
        buf: [255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 1099511627775, decimal: -524288 - DEC20, unsignedDecimal: 1048576 + DEC20}
      },
      int48X: {
        buf: [255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 281474976710655, decimal: -8388608 - DEC24, unsignedDecimal: 16777215 + DEC24}
      },
      int56X: {
        buf: [255, 255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, decimal: -134217728 - DEC28, unsignedDecimal: 268435455 + DEC28}
      },
      int64X: {
        buf: [255, 255, 255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, decimal: -2147483648 - DEC32, unsignedDecimal: 4294967295 + DEC32}
      }
      };

  it('reads numbers', function () {
    Object.keys(buffer).forEach(key => {
      var entry = buffer[key],
          buf = entry.buf,
          len = buf.length,
          expectedValues = entry.val,
          readBytesNum, expected, readValue;
if (len % 2 && len !== 1) {
  return;
}
      console.log(`[${key}]----`);

      [readBytesNum, readValue] = Reader.readNumber(buf, 0, len);
      expect(readBytesNum).toBe(len);
      expected = expectedValues.unsignedInt;
      expect(readValue).toBe(expected);

      console.log(`\tUINT: expected=${expected} actual=${readValue}`);

      [readBytesNum, readValue] = Reader.readNumber(buf, 0, len, true);
      expect(readBytesNum).toBe(len);
      expected = expectedValues.signedInt;
      expect(readValue).toBe(expected);

      console.log(`\tINT: expected=${expected} actual=${readValue}`);

      [readBytesNum, readValue] = Reader.readFixedNumber(buf, 0, len);
      expect(readBytesNum).toBe(len);
      expected = expectedValues.unsignedDecimal;
      expect(readValue).toBe(expected);

      console.log(`\tUDEC: expected=${expected} actual=${readValue}`);

      [readBytesNum, readValue] = Reader.readFixedNumber(buf, 0, len, true);
      expect(readBytesNum).toBe(len);
      expected = expectedValues.decimal;
      expect(readValue).toBe(expected);

      console.log(`\tDEC: expected=${expected} actual=${readValue}`);
    });
  });
});
