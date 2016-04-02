const DEC4 = 15 / 16,
    DEC8 = 255 / 256,
    DEC12 = 4095 / 4096,
    DEC16 = 65535 / 65536,
    DEC20 = 1048575 / 1048576,
    DEC24 = 16777215 / 16777216,
    DEC28 = 268435455 / 268435456,
    DEC32 = 4294967295 / 4294967296;

export default {
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
        val: {signedInt: -1, unsignedInt: 255, decimal: -1 - DEC4, unsignedDecimal: 15 + DEC4}
      },
      int16X: {
        buf: [255, 255],
        val: {signedInt: -1, unsignedInt: 65535, decimal: -1 - DEC8, unsignedDecimal: 255 + DEC8}
      },
      int24X: {
        buf: [255, 255, 255],
        val: {signedInt: -1, unsignedInt: 16777215, decimal: -1 - DEC12, unsignedDecimal: 4095 + DEC12}
      },
      int32X: {
        buf: [255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 4294967295, decimal: -1 - DEC16, unsignedDecimal: 65535 + DEC16}
      },
      int40X: {
        buf: [255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 1099511627775, decimal: -1 - DEC20, unsignedDecimal: 1048576 + DEC20}
      },
      int48X: {
        buf: [255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: 281474976710655, decimal: -1 - DEC24, unsignedDecimal: 16777215 + DEC24}
      },
      int56X: {
        buf: [255, 255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, decimal: -1 - DEC28, unsignedDecimal: 268435455 + DEC28}
      },
      int64X: {
        buf: [255, 255, 255, 255, 255, 255, 255, 255],
        val: {signedInt: -1, unsignedInt: Number.MAX_SAFE_INTEGER, decimal: -1 - DEC32, unsignedDecimal: 4294967295 + DEC32}
      }
};
